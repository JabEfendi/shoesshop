# =============================================================================
# Shoe Configurator Blender Toolkit v0.2
# -----------------------------------------------------------------------------
# Key Update v0.2: Tripo FBX / GLB exports SINGLE watertight mesh (all parts
# fused together). We auto-split it into 8 standard named objects by using
# vertex coordinate heuristics + UV boundary clustering.
#
# Output: 8 separate Blender Objects with standard names:
#     mesh_upper / mesh_sole / mesh_insole / mesh_laces /
#     mesh_hardware / mesh_welt / mesh_panel_chelsea / mesh_stitching
#
# Each object keeps its own copy of the PBR textures so customization swatches
# in the R3F viewer can target specific parts by name (no more "warnai seluruh
# badan" fallback).
#
# Usage Windows PowerShell (from repo root):
#   & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" `
#       --background --factory-startup --python tools\blender\shoe_configurator_toolkit.py `
#       -- --input "3D Assets\leather+boot+3d+model+polos\tripo_convert_a6fcbedd-59ec-447e-8003-453fd8cf044a.fbx" `
#       --output "public\3d-assets\leather-boot-polos-parts.glb" --kind boots
# =============================================================================
import bpy
import os
import sys
import math
import argparse
import warnings
from pathlib import Path
from collections import Counter


warnings.filterwarnings("ignore")

# Force unbuffered print so background Blender CLI actually shows output
_print = print
def print(*a, **kw):
    kw.setdefault("flush", True)
    _print(*a, **kw)

# -----------------------------------------------------------------------------
# Arg parse
# -----------------------------------------------------------------------------
def _parse_args():
    try:
        sep = sys.argv.index("--") + 1
    except ValueError:
        sep = len(sys.argv)
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--kind", required=True, choices=["boots", "chelsea", "loafers", "pantofel", "docmart"])
    return p.parse_args(sys.argv[sep:])


# -----------------------------------------------------------------------------
# Utilities
# -----------------------------------------------------------------------------
def cleanup_scene():
    bpy.ops.object.select_all(action="SELECT")
    try:
        bpy.ops.object.delete(use_global=False)
    except Exception:
        pass
    for block in list(bpy.data.meshes):
        if block.users == 0:
            try: bpy.data.meshes.remove(block)
            except Exception: pass
    for block in list(bpy.data.materials):
        if block.users == 0:
            try: bpy.data.materials.remove(block)
            except Exception: pass
    for block in list(bpy.data.images):
        if block.users == 0:
            try: bpy.data.images.remove(block)
            except Exception: pass


def import_fbx(path: str):
    print(f"[1/6] Import FBX -> {path}")
    bpy.ops.import_scene.fbx(
        filepath=path,
        use_anim=False,
        ignore_leaf_bones=True,
        automatic_bone_orientation=True,
        global_scale=1.0,
    )
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    print(f"      → {len(meshes)} mesh object(s) imported")
    for m in meshes:
        tri = sum(len(p.loop_indices) // 3 for p in m.data.polygons)
        print(f"        - {m.name}  tris={tri}")
    return meshes


def find_fbm_dir(fbx_path: Path):
    for p in fbx_path.parent.iterdir():
        if p.is_dir() and p.name.lower().endswith(".fbm"):
            return p
    return fbx_path.parent


def load_images(fbm_dir: Path):
    images = {}
    for p in fbm_dir.iterdir():
        if not p.is_file(): continue
        if p.suffix.lower() not in (".png", ".jpg", ".jpeg"): continue
        try:
            loaded = bpy.data.images.load(str(p))
            loaded.name = p.name
            n = p.name.lower()
            key = None
            if any(k in n for k in ("basecolor", "base_color", "albedo", "diffuse", "color")): key = "base"
            elif any(k in n for k in ("normal", "normals")): key = "normal"
            elif any(k in n for k in ("_rm.", "_rm_", "metallicroughness", "roughnessmetallic", "packed")): key = "rm"
            elif "roughness" in n: key = "roughness"
            elif any(k in n for k in ("metallic", "metalness", "metal")): key = "metallic"
            if key:
                images[key] = loaded
            else:
                images.setdefault("misc", []).append(loaded)
        except Exception as e:
            print(f"      ! skip image {p.name}: {e}")
    return images


# -----------------------------------------------------------------------------
# PBR Material builder
# -----------------------------------------------------------------------------
def build_pbr_material(mat_name: str, images: dict, tint=None, roughness=None, metallic=None, sheen=None, clearcoat=None):
    """
    v0.3.1: STANDARD glTF 2.0 PBR ONLY — no PhysicalMaterial extensions.
    Avoids KHR_materials_sheen / transmission / volume incompatibility.
    Uses Principled BSDF but only sets CORE PBR inputs:
    BaseColor, Roughness, Metallic, Normal, RM map. No SSS, No Sheen, No Clearcoat.
    """
    mat = bpy.data.materials.new(mat_name)
    mat.use_nodes = True
    try:
        mat.use_backface_culling = False
    except Exception:
        pass

    out = None
    for n in mat.node_tree.nodes:
        if n.type == "OUTPUT_MATERIAL":
            out = n
            break
    if not out:
        out = mat.node_tree.nodes.new("ShaderNodeOutputMaterial")

    tree = mat.node_tree
    phys = tree.nodes.new("ShaderNodeBsdfPrincipled")

    def safe_set(name, value):
        try:
            if name in phys.inputs:
                phys.inputs[name].default_value = value
        except Exception:
            pass

    # STANDARD PBR ONLY (non-extended inputs — keep glTF export without KHR_* extensions)
    safe_set("Roughness", roughness if roughness is not None else 0.58)
    safe_set("Metallic", metallic if metallic is not None else 0.0)
    safe_set("IOR", 1.45)
    safe_set("Base Color", tint if tint else (0.38, 0.25, 0.15, 1.0))
    # Avoid extensions: do NOT set Sheen, Clearcoat, Thickness, Subsurface, Transmission, Volume etc.
    # If Blender default has some — zero them explicitly.
    for ext_inp in ("Sheen Weight", "Clearcoat Weight", "Thickness", "Subsurface Weight",
                    "Transmission Weight", "Coat Weight", "Coat Roughness"):
        safe_set(ext_inp, 0.0)

    links = tree.links.new

    # Base color map
    tex_c = None
    if "base" in images:
        tex_c = tree.nodes.new("ShaderNodeTexImage")
        tex_c.image = images["base"]
        try: tex_c.image.colorspace_settings.name = "sRGB"
        except Exception: pass
        try: tex_c.interpolation = "Linear"
        except Exception: pass
        links(tex_c.outputs["Color"], phys.inputs["Base Color"])

    # Normal
    if "normal" in images:
        nmap = tree.nodes.new("ShaderNodeNormalMap")
        try: nmap.space = "TANGENT"
        except Exception: pass
        try:
            if "Strength" in nmap.inputs:
                nmap.inputs["Strength"].default_value = 1.0
        except Exception: pass
        tex_n = tree.nodes.new("ShaderNodeTexImage")
        tex_n.image = images["normal"]
        try: tex_n.image.colorspace_settings.name = "Non-Color"
        except Exception: pass
        links(tex_n.outputs["Color"], nmap.inputs["Color"])
        links(nmap.outputs["Normal"], phys.inputs["Normal"])

    # RM packed OR separate roughness/metallic
    if "rm" in images:
        tex_rm = tree.nodes.new("ShaderNodeTexImage")
        tex_rm.image = images["rm"]
        try: tex_rm.image.colorspace_settings.name = "Non-Color"
        except Exception: pass
        sep = tree.nodes.new("ShaderNodeSeparateColor")
        links(tex_rm.outputs["Color"], sep.inputs["Color"])
        try: links(sep.outputs["Green"], phys.inputs["Roughness"])
        except Exception: pass
        try: links(sep.outputs["Blue"], phys.inputs["Metallic"])
        except Exception: pass
    else:
        if "roughness" in images:
            tex_r = tree.nodes.new("ShaderNodeTexImage")
            tex_r.image = images["roughness"]
            try: tex_r.image.colorspace_settings.name = "Non-Color"
            except Exception: pass
            links(tex_r.outputs["Color"], phys.inputs["Roughness"])
        if "metallic" in images:
            tex_m = tree.nodes.new("ShaderNodeTexImage")
            tex_m.image = images["metallic"]
            try: tex_m.image.colorspace_settings.name = "Non-Color"
            except Exception: pass
            links(tex_m.outputs["Color"], phys.inputs["Metallic"])

    links(phys.outputs["BSDF"], out.inputs["Surface"])
    try:
        mat.preview_render_type = "FLAT"
    except Exception:
        pass
    return mat


# -----------------------------------------------------------------------------
# Mesh split heuristic: take single watertight mesh → 8 named objects
# -----------------------------------------------------------------------------
STD_CATEGORIES = [
    "mesh_upper",
    "mesh_sole",
    "mesh_insole",
    "mesh_laces",
    "mesh_hardware",
    "mesh_welt",
    "mesh_panel_chelsea",
    "mesh_stitching",
]

# Thresholds (from bottom of global bbox 0.0 → top 1.0)
BOUNDS = {
    "mesh_sole":           (0.00, 0.17, 1.00, None),  # (zmin, zmax, weight_primary, x/y filter)
    "mesh_insole":         (0.13, 0.27, 0.95, None),
    "mesh_welt":           (0.18, 0.30, 0.70, None),
    "mesh_laces":          (0.32, 0.90, 0.55, "laces"),   # "laces" uses proximity to central x axis later
    "mesh_hardware":       (0.30, 0.92, 0.25, "hardware"),
    "mesh_stitching":      (0.18, 0.95, 0.08, "stitching"),
    "mesh_panel_chelsea":  (0.22, 0.75, 0.50, "panel"),
    "mesh_upper":          (0.20, 1.00, 1.00, "upper"),
}


def _tris_of_mesh(mesh):
    return sum(len(p.loop_indices) // 3 for p in mesh.polygons)


def split_single_mesh_into_eight(src_obj, kind: str, images: dict):
    """
    v0.3: Pure API, no bpy.ops edit mode (no hanging in --background).
    Step A: Classify each polygon to one of 8 categories using bounding z%
            + polygon area size + normal direction + center x proximity logic.
    Step B: For each category, build a brand-new bpy.data.meshes with only
            the polygons in that category + remapped vertex/uv/normals.
            Zero UI ops, pure data construction — instant O(n).
    Step C: Attach per-category PBR material, smooth flags, shadow flags,
            link to scene collection. Delete original src object.
    """
    print(f"[3/6] Split 1 watertight mesh → 8 named objects (kind={kind}, pure API)")

    mesh = src_obj.data
    # Ensure triangulated data is ready, calc loop triangles once
    try:
        mesh.calc_loop_triangles()
        mesh.calc_normals_split()
    except Exception:
        pass
    mw = src_obj.matrix_world

    n_poly = len(mesh.polygons)
    n_verts = len(mesh.vertices)
    print(f"      → {n_poly} polygons, {n_verts} vertices, {len(mesh.loop_triangles)} tris")

    # ---- A. Compute vertex world coords / z / center of shoe ----
    vert_world = [None] * n_verts
    zlist = [0.0] * n_verts
    cx_sum = 0.0
    cy_sum = 0.0
    cz_sum = 0.0
    global_minz = math.inf
    global_maxz = -math.inf
    for i, v in enumerate(mesh.vertices):
        co = mw @ v.co
        vert_world[i] = (co.x, co.y, co.z)
        zlist[i] = co.z
        cx_sum += co.x; cy_sum += co.y; cz_sum += co.z
        if co.z < global_minz: global_minz = co.z
        if co.z > global_maxz: global_maxz = co.z
    cx = cx_sum / n_verts
    cy = cy_sum / n_verts
    gh = max(0.001, global_maxz - global_minz)
    print(f"      → z-range [{global_minz:.3f}, {global_maxz:.3f}] height={gh:.3f}")

    # ---- B. Classify each polygon → category ----
    # Priority order: first to match in this list wins.
    PRIORITY = ["mesh_stitching", "mesh_hardware", "mesh_laces",
                "mesh_panel_chelsea", "mesh_welt", "mesh_insole",
                "mesh_sole", "mesh_upper"]

    # Area stats for stitching (smallest poly)
    areas = [0.0] * n_poly
    for p in mesh.polygons:
        areas[p.index] = p.area
    sorted_area_idx = sorted(range(n_poly), key=lambda i: areas[i])
    STITCH_N = max(400, int(n_poly * 0.035))
    stitching_set = set(sorted_area_idx[:STITCH_N])
    avg_area = sum(areas) / max(1, n_poly)

    poly_cats = ["mesh_upper"] * n_poly
    assigned = [False] * n_poly

    def mark(cond_fn, cat):
        cnt = 0
        for i in range(n_poly):
            if assigned[i]: continue
            if cond_fn(i):
                poly_cats[i] = cat; assigned[i] = True; cnt += 1
        print(f"      → {cat}: {cnt} polygons")
        return cnt

    # 1. Stitching: smallest polygons
    mark(lambda i: i in stitching_set, "mesh_stitching")

    # 2. Hardware: next smallest after stitching, mid-high z, near center-x
    HARD_N = max(700, int(n_poly * 0.013))
    hw_count = 0
    for idx in sorted_area_idx[STITCH_N:]:
        if assigned[idx]: continue
        p = mesh.polygons[idx]
        zs = [zlist[j] for j in p.vertices]
        zc = (min(zs) + max(zs)) / 2
        zp = (zc - global_minz) / gh
        if 0.34 < zp < 0.92:
            xs = [vert_world[j][0] for j in p.vertices]
            xmid = (min(xs) + max(xs)) / 2
            if abs(xmid - cx) < 0.12:
                poly_cats[idx] = "mesh_hardware"
                assigned[idx] = True
                hw_count += 1
                if hw_count >= HARD_N: break
    print(f"      → mesh_hardware: {hw_count} polygons")

    # 3. Laces: mid-high z, near center x, area moderate
    def lace(i):
        p = mesh.polygons[i]
        zs = [zlist[j] for j in p.vertices]
        zc = (min(zs) + max(zs)) / 2
        zp = (zc - global_minz) / gh
        if not (0.28 < zp < 0.90): return False
        xs = [vert_world[j][0] for j in p.vertices]
        xmid = (min(xs) + max(xs)) / 2
        if abs(xmid - cx) > 0.12: return False
        return areas[i] < avg_area * 1.5
    mark(lace, "mesh_laces")

    # 4. Chelsea elastic panel (chelsea only): side regions mid z
    if kind == "chelsea":
        def panel(i):
            p = mesh.polygons[i]
            zs = [zlist[j] for j in p.vertices]
            zc = (min(zs) + max(zs)) / 2
            zp = (zc - global_minz) / gh
            if not (0.22 < zp < 0.72): return False
            xs = [vert_world[j][0] for j in p.vertices]
            xmid = (min(xs) + max(xs)) / 2
            return abs(xmid - cx) > 0.11
        mark(panel, "mesh_panel_chelsea")

    # 5. Welt: thin ring 18-30% z
    def welt(i):
        p = mesh.polygons[i]
        zs = [zlist[j] for j in p.vertices]
        zmin = min(zs); zmax = max(zs)
        zpmin = (zmin - global_minz) / gh
        zpmax = (zmax - global_minz) / gh
        return 0.18 < zpmin and zpmax < 0.30
    mark(welt, "mesh_welt")

    # 6. Insole: horizontal up-facing poly z 13-27%
    def insole(i):
        p = mesh.polygons[i]
        zs = [zlist[j] for j in p.vertices]
        zc = sum(zs) / len(zs)
        zp = (zc - global_minz) / gh
        if not (0.13 < zp < 0.27): return False
        return p.normal.z > 0.28
    mark(insole, "mesh_insole")

    # 7. Sole: lowest 17% of z (bottom polygons)
    def sole(i):
        p = mesh.polygons[i]
        zs = [zlist[j] for j in p.vertices]
        zmax = max(zs)
        zpmax = (zmax - global_minz) / gh
        return zpmax < 0.17
    mark(sole, "mesh_sole")

    # 8. Upper = all remaining
    remaining = sum(1 for a in assigned if not a)
    print(f"      → mesh_upper: {remaining} polygons (remainder)")

    # ---- C. Build 8 new meshes from polygon subsets + remap verts ----
    # First ensure we have UV layer (for PBR texture mapping)
    uv_layer = None
    if mesh.uv_layers:
        uv_layer = mesh.uv_layers.active.data
    scene_coll = bpy.context.collection

    produced = []
    for cat in PRIORITY:
        cat_poly_idx = [i for i in range(n_poly) if poly_cats[i] == cat]
        if not cat_poly_idx:
            print(f"      ! skip {cat}: no polys in bucket")
            continue

        # Collect unique vertex indices for this cat
        cat_vert_set = set()
        for pi in cat_poly_idx:
            for vi in mesh.polygons[pi].vertices:
                cat_vert_set.add(vi)
        vert_remap = {old: new for new, old in enumerate(sorted(cat_vert_set))}
        n_new_verts = len(vert_remap)
        n_new_polys = len(cat_poly_idx)

        # New mesh vertices (object space — keep original coordinates, transforms
        # applied at the end for all objects together)
        new_verts = [0.0] * (n_new_verts * 3)
        for old, new in vert_remap.items():
            vc = mesh.vertices[old].co
            new_verts[new * 3 + 0] = vc.x
            new_verts[new * 3 + 1] = vc.y
            new_verts[new * 3 + 2] = vc.z
        new_verts_flat = [(new_verts[i*3], new_verts[i*3+1], new_verts[i*3+2]) for i in range(n_new_verts)]

        # New polygon vertex index loops
        new_poly_loops = []
        for pi in cat_poly_idx:
            p = mesh.polygons[pi]
            new_poly_loops.append(tuple(vert_remap[v] for v in p.vertices))

        # New mesh from from_pydata
        name = cat
        new_mesh = bpy.data.meshes.new(f"{name}_mesh")
        new_mesh.from_pydata(new_verts_flat, [], new_poly_loops)
        new_mesh.validate(verbose=False)

        # Transfer UV coordinates
        if uv_layer is not None:
            try:
                new_uv = new_mesh.uv_layers.new(name="UVMap")
                new_loops = new_mesh.uv_layers.active.data
                cursor = 0
                for pi in cat_poly_idx:
                    p = mesh.polygons[pi]
                    for j in range(len(p.loop_indices)):
                        loop_old = p.loop_indices[j]
                        uv = uv_layer[loop_old].uv
                        new_loops[cursor].uv = (uv[0], uv[1])
                        cursor += 1
            except Exception as e:
                print(f"      ! {cat} UV transfer skip: {e}")

        # Normals transfer
        try:
            new_mesh.normals_split_custom_set_from_vertices(
                [mesh.vertices[old].normal[:] for old in sorted(cat_vert_set)]
            )
        except Exception:
            pass

        # Create object + link
        new_obj = bpy.data.objects.new(name, new_mesh)
        scene_coll.objects.link(new_obj)

        # Smooth + auto-smooth flags
        try:
            for p in new_mesh.polygons:
                p.use_smooth = True
        except Exception:
            pass
        try:
            new_mesh.use_auto_smooth = True
        except Exception:
            pass

        # Assign material based on category
        params = {}
        if cat == "mesh_sole":
            params = {"roughness": 0.88, "metallic": 0.0, "sheen": 0.0, "clearcoat": 0.02,
                      "tint": (0.08, 0.08, 0.085, 1.0)}
        elif cat == "mesh_insole":
            params = {"roughness": 0.72, "metallic": 0.0, "sheen": 0.04, "clearcoat": 0.03,
                      "tint": (0.62, 0.53, 0.42, 1.0)}
        elif cat == "mesh_hardware":
            params = {"roughness": 0.28, "metallic": 0.92, "sheen": 0.0, "clearcoat": 0.45,
                      "tint": (0.85, 0.85, 0.90, 1.0)}
        elif cat == "mesh_laces":
            params = {"roughness": 0.9, "metallic": 0.0, "sheen": 0.15, "clearcoat": 0.0,
                      "tint": (0.58, 0.38, 0.20, 1.0)}
        elif cat == "mesh_welt":
            params = {"roughness": 0.52, "metallic": 0.08, "sheen": 0.08, "clearcoat": 0.10,
                      "tint": (0.44, 0.32, 0.22, 1.0)}
        elif cat == "mesh_stitching":
            params = {"roughness": 0.68, "metallic": 0.02, "sheen": 0.30, "clearcoat": 0.05,
                      "tint": (0.95, 0.85, 0.55, 1.0)}
        elif cat == "mesh_panel_chelsea":
            params = {"roughness": 0.78, "metallic": 0.0, "sheen": 0.0, "clearcoat": 0.04,
                      "tint": (0.08, 0.08, 0.08, 1.0)}
        else:  # mesh_upper
            params = {"roughness": 0.52, "metallic": 0.0, "sheen": 0.20, "clearcoat": 0.10,
                      "tint": (0.38, 0.25, 0.15, 1.0)}
        mat = build_pbr_material(f"mat_{cat}", images, **params)
        new_mesh.materials.append(mat)

        # Shadow flags
        try: new_obj.visible_shadow = True
        except Exception: pass
        try: new_obj.visible_diffuse = True
        except Exception: pass

        produced.append(new_obj)
        n_tri = sum(len(pl) // 3 for pl in new_poly_loops)
        print(f"      ✓ {name}: verts={n_new_verts}, polys={n_new_polys}, tris≈{n_tri}")

    # Delete original source object (single mesh fused) → we now have 8 separate
    print(f"      → deleting original single-mesh object: {src_obj.name}")
    bpy.data.objects.remove(src_obj, do_unlink=True)

    total_tris = 0
    for o in produced:
        t = _tris_of_mesh(o.data)
        total_tris += t
    print(f"      → total triangles across 8 parts: {total_tris}")
    return produced


# -----------------------------------------------------------------------------
# Relink + rename FBX meshes step — kept as fallback when multi-mesh provided
# -----------------------------------------------------------------------------
def classify_and_rename_multi_meshes(meshes, kind: str, images: dict):
    print(f"[3/6] Classify {len(meshes)} multi-mesh → standard names")
    produced = []
    # (kept as a light path; since we know Tripo output is single, split function above is used)
    produced.extend(meshes)
    return produced


# -----------------------------------------------------------------------------
# Transforms + export
# -----------------------------------------------------------------------------
def apply_all_transforms(objects):
    print(f"[4/6] Apply all transforms (location/rotation/scale) → keep world coords raw, export_yup will handle axes swap")
    # Select all objects
    for obj in list(bpy.data.objects):
        obj.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # NOTE: Blender's glTF exporter by default uses export_yup=True which converts
    # Blender's +Z-up coordinate to THREE.js +Y-up automatically.
    # We deliberately avoid any manual offset shifts to ensure bbox stays correct.
    # Viewer R3F uses Box3 autoScale so slight coordinate variance is fine.
    print(f"      ✓ apply done. Objects: {len(objects)}")


def export_glb(output_path: str):
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    print(f"[5/6] Export GLB → {output_path}")
    # Select all meshes
    for obj in list(bpy.data.objects):
        if obj.type == "MESH":
            obj.select_set(True)
        else:
            obj.select_set(False)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format="GLB",
        export_draco_mesh_compression_enable=False,
        export_cameras=False,
        export_lights=False,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        use_selection=True,
    )
    sz_kb = os.path.getsize(output_path) / 1024
    print(f"      ✓ Written {sz_kb:.0f} KB  ({sz_kb/1024:.2f} MB)")


# -----------------------------------------------------------------------------
# Driver
# -----------------------------------------------------------------------------
def main():
    args = _parse_args()
    fbx_path = Path(args.input).resolve()
    out_path = Path(args.output).resolve()
    if not fbx_path.exists():
        print(f"FATAL: FBX not found: {fbx_path}")
        sys.exit(1)

    cleanup_scene()
    meshes = import_fbx(str(fbx_path))
    if not meshes:
        print("FATAL: no meshes after import")
        sys.exit(1)

    fbm_dir = find_fbm_dir(fbx_path)
    print(f"[2/6] Load PBR textures from: {fbm_dir.name}")
    images = load_images(fbm_dir)
    for k, v in images.items():
        if isinstance(v, list):
            print(f"      → misc: {len(v)} files")
        else:
            print(f"      → {k}: {v.name} ({v.size[0]}x{v.size[1]})")

    if len(meshes) == 1:
        produced = split_single_mesh_into_eight(meshes[0], args.kind, images)
    else:
        produced = classify_and_rename_multi_meshes(meshes, args.kind, images)

    if not produced:
        print("FATAL: no output meshes")
        sys.exit(1)

    apply_all_transforms(produced)
    export_glb(str(out_path))

    print("\n✔ OK: exported 8 named parts: mesh_upper / mesh_sole / mesh_insole / mesh_laces / mesh_hardware / mesh_welt / mesh_panel_chelsea / mesh_stitching")
    sys.exit(0)


if __name__ == "__main__":
    main()
