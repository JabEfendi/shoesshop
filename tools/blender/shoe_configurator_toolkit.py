# ============================================================
# 3D SHOE CONFIGURATOR — BLENDER MESH SEPARATOR TOOLKIT
# ============================================================
# Lokasi  : d:\Project\shoesshop\tools\blender\shoe_configurator_toolkit.py
# Fungsi  : Otomatis 80% pekerjaan: import GLB → separate mesh →
#           rename konvensi → reset transform → decimate → export
# Cara pakai:
#   1. Buka Blender 4.x → pilih Scripting workspace
#   2. Klik Open → pilih file ini
#   3. Klik [ ▶ Run Script ] — panel akan muncul di sidebar 3D View
#      (tekan N di 3D View jika sidebar tidak muncul → tab "Shoe Toolkit")
# ============================================================

import bpy
import os
import shutil
from bpy.props import StringProperty, FloatProperty, EnumProperty, BoolProperty
from bpy.types import Operator, Panel, PropertyGroup

# ----------------------------------------------------------------
# HEURISTIC RENAME RULES — sesuaikan nama material model Anda disini!
# (Kata kunci lowercase, akan dicocokkan substring dengan nama material)
# ----------------------------------------------------------------
RENAME_RULES = [
    # (keyword_dalam_nama_material, nama_target_mesh)
    ("sole", "mesh_sole"),
    ("outsole", "mesh_sole"),
    ("sol", "mesh_sole"),
    ("midsole", "mesh_sole"),
    ("insole", "mesh_insole"),
    ("footbed", "mesh_insole"),
    ("upper", "mesh_upper"),
    ("leather", "mesh_upper"),
    ("kulit", "mesh_upper"),
    ("vamp", "mesh_upper"),
    ("quarter", "mesh_upper"),
    ("shoe_body", "mesh_upper"),
    ("shoe", "mesh_upper"),
    ("laces", "mesh_laces"),
    ("lace", "mesh_laces"),
    ("tali", "mesh_laces"),
    ("shoelace", "mesh_laces"),
    ("string", "mesh_laces"),
    ("tongue", "mesh_tongue"),
    ("lidah", "mesh_tongue"),
    ("buckle", "mesh_hardware"),
    ("hardware", "mesh_hardware"),
    ("metal", "mesh_hardware"),
    ("logam", "mesh_hardware"),
    ("zipper", "mesh_hardware"),
    ("eyelet", "mesh_hardware"),
    ("hook", "mesh_hardware"),
    ("stitch", "mesh_stitching"),
    ("stitching", "mesh_stitching"),
    ("thread", "mesh_stitching"),
    ("jahit", "mesh_stitching"),
    ("heel", "mesh_heel"),
    ("counter", "mesh_heel"),
    ("toe", "mesh_toe_cap"),
    ("cap", "mesh_toe_cap"),
    ("lining", "mesh_lining"),
    ("padded", "mesh_lining"),
]

MESH_CATEGORY_ORDER = ["mesh_upper", "mesh_sole", "mesh_insole", "mesh_laces",
                       "mesh_tongue", "mesh_hardware", "mesh_stitching",
                       "mesh_heel", "mesh_toe_cap", "mesh_lining"]

# =================================================================
# PROPERTY GROUP
# =================================================================
class ShoeToolkitProps(PropertyGroup):
    input_glb_path: StringProperty(
        name="Input GLB",
        description="Pilih file .glb sumber (misal: leather boot 3d model.glb)",
        default="",
        maxlen=1024,
        subtype="FILE_PATH"
    )
    output_dir: StringProperty(
        name="Output Directory",
        description="Folder untuk menyimpan hasil .glb yang dioptimize",
        default=r"D:\Project\shoesshop\3D Assets",
        maxlen=1024,
        subtype="DIR_PATH"
    )
    output_filename: StringProperty(
        name="Output File Name",
        description="Nama file output (tanpa ekstensi, otomatis .glb)",
        default="leather-boot-optimized"
    )
    decimate_ratio: FloatProperty(
        name="Decimate Ratio",
        description="Semakin kecil = semakin sedikit poly. 0.5 = potong 50%.",
        default=0.5,
        min=0.05,
        max=1.0,
        step=1,
        precision=2
    )
    target_category: EnumProperty(
        name="Rename to (manual)",
        description="Untuk rename mesh yang dipilih secara manual",
        items=[(c, c.replace("mesh_", "").title(), "") for c in MESH_CATEGORY_ORDER] +
              [("KEEP", "— Jangan Rename —", "")],
        default="KEEP"
    )
    use_webp: BoolProperty(name="WebP Textures (lebih kecil)", default=True)
    use_draco: BoolProperty(name="Draco Compression (WAJIB)", default=True)
    apply_modifiers: BoolProperty(name="Apply Modifiers", default=True)

# =================================================================
# HELPER FUNCTIONS
# =================================================================

def clear_scene():
    """Hapus semua objek (kecuali yang kita buat sendiri)."""
    bpy.ops.object.select_all(action="SELECT")
    for obj in list(bpy.data.objects):
        if obj.type in ("MESH", "CAMERA", "LIGHT", "EMPTY", "ARMATURE"):
            bpy.data.objects.remove(obj, do_unlink=True)
    # Purge orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)
    for block in bpy.data.images:
        if block.users == 0:
            bpy.data.images.remove(block)


def import_glb(filepath):
    """Impor GLB dengan setting aman."""
    clear_scene()
    if not os.path.isfile(filepath):
        return False, f"File tidak ditemukan: {filepath}"
    try:
        bpy.ops.import_scene.gltf(
            filepath=filepath,
            import_pack_images=True,
            import_shading="NORMALS",
            bone_heuristic="TEMPERANCE",
            guess_original_bind_pose=True,
            merge_vertices=True,
        )
        return True, f"Impor berhasil. Objek mesh baru: {len([o for o in bpy.data.objects if o.type == 'MESH'])}"
    except Exception as e:
        return False, f"Impor gagal: {str(e)}"


def get_all_meshes():
    return [o for o in bpy.data.objects if o.type == "MESH"]


def material_name_of(obj, idx=0):
    if not obj.data.materials or len(obj.data.materials) == 0:
        return ""
    m = obj.data.materials[idx]
    return m.name.lower() if m else ""


def heuristic_rename(mesh_obj):
    """Cocokkan nama material dengan RENAME_RULES. Return nama baru atau None."""
    mat_names = [material_name_of(mesh_obj, i) for i in range(len(mesh_obj.data.materials))]
    name_haystack = (mesh_obj.name.lower() + " " + " ".join(mat_names)).lower()
    # Loop rule: yang lebih spesifik lebih dulu (panjang keyword terpanjang dulu)
    for kw, target in sorted(RENAME_RULES, key=lambda r: -len(r[0])):
        if kw in name_haystack:
            return target
    return None


def separate_by_material_all():
    """Untuk setiap mesh multi-material → pisahkan per material slot."""
    changed = 0
    all_meshes = get_all_meshes()
    for obj in all_meshes:
        if len(obj.data.materials) <= 1:
            continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        try:
            bpy.ops.mesh.separate(type="MATERIAL")
            changed += 1
        except Exception as e:
            print(f"Skip separate {obj.name}: {e}")
        finally:
            bpy.ops.object.mode_set(mode="OBJECT")
        obj.select_set(False)
    return changed


def heuristic_rename_all():
    """Rename SEMUA mesh berdasarkan RENAME_RULES → return laporan."""
    renamed, skipped = [], []
    used_names = {}
    for m in get_all_meshes():
        new_name = heuristic_rename(m)
        if new_name:
            # Hindari duplikat nama (misal 2 mesh upper → mesh_upper_01, mesh_upper_02)
            if new_name in used_names:
                used_names[new_name] += 1
                final_name = f"{new_name}_{used_names[new_name]:02d}"
            else:
                used_names[new_name] = 1
                final_name = new_name
            old = m.name
            m.name = final_name
            m.data.name = final_name
            renamed.append((old, final_name, material_name_of(m)))
        else:
            skipped.append((m.name, material_name_of(m), m.data.vertices.__len__()))
    return renamed, skipped


def reset_transforms_and_center():
    """Apply transform → center ke world origin → sumbu +Z up, face -Y."""
    meshes = get_all_meshes()
    for m in meshes:
        m.select_set(True)
    if meshes:
        bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # Origin to geometry per objek
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")
    # Center ke cursor (yang di origin)
    bpy.ops.view3d.snap_cursor_to_center()
    bpy.ops.view3d.snap_selected_to_cursor(use_offset=False)
    bpy.ops.object.select_all(action="DESELECT")
    return len(meshes)


def decimate_all(ratio):
    """Apply Decimate modifier ke semua mesh, return laporan vertex count before/after."""
    report = []
    for m in get_all_meshes():
        before = len(m.data.vertices)
        mod = m.modifiers.new(name="DecimateShoe", type="DECIMATE")
        mod.ratio = ratio
        mod.use_collapse_triangulate = True
        try:
            bpy.context.view_layer.objects.active = m
            bpy.ops.object.modifier_apply(modifier=mod.name)
        except Exception as e:
            report.append((m.name, before, "APPLY GAGAL", str(e)))
            continue
        after = len(m.data.vertices)
        report.append((m.name, before, after, f"{100*(before-after)/before:.0f}%" if before>0 else "0%"))
    return report


def export_glb(out_dir, filename, use_webp, use_draco, apply_mods):
    """Export GLB dengan WebP + Draco."""
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{filename}.glb")
    # Pilih semua mesh
    for m in get_all_meshes():
        m.select_set(True)
    # Temporary hapus objek non-mesh (camera/light sudah kita clear di awal)
    try:
        export_kwargs = dict(
            filepath=out_path,
            use_selection=True,
            export_apply=apply_mods,
            export_cameras=False,
            export_lights=False,
            export_yup=True,
            export_texcoords=True,
            export_normals=True,
            export_draco_mesh_compression_enable=use_draco,
            export_draco_mesh_compression_level=7,
            export_draco_position_quantization=14,
            export_draco_normal_quantization=10,
            export_draco_texcoord_quantization=12,
            export_draco_color_quantization=10,
            export_draco_generic_quantization=12,
            export_image_format="WEBP" if use_webp else "JPEG",
            export_jpeg_quality=85,
            export_webp_image_quality=82,
            export_webp_image_lossless=False,
            export_materials="EXPORT",
            export_colors=True,
        )
        # Blender 4.x: gunakan gltf export
        bpy.ops.export_scene.gltf(**export_kwargs)
        size_kb = os.path.getsize(out_path) / 1024
        size_mb = size_kb / 1024
        return True, f"Export OK → {out_path}\nUkuran: {size_mb:.2f} MB  ({size_kb:,.0f} KB)"
    except Exception as e:
        return False, f"Export GAGAL: {str(e)}"


def build_report_panel(title, lines):
    return f"{title}\n  " + "\n  ".join(lines) if lines else f"{title}\n  (kosong)"


# =================================================================
# OPERATORS (Tombol di panel)
# =================================================================

class SHTK_OT_ImportGLB(Operator):
    bl_idname = "shtk.import_glb"
    bl_label = "1. Import GLB"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        props = context.scene.shtk_props
        ok, msg = import_glb(bpy.path.abspath(props.input_glb_path))
        self.report({"INFO" if ok else "ERROR"}, msg)
        return {"FINISHED"} if ok else {"CANCELLED"}


class SHTK_OT_SeparateMaterials(Operator):
    bl_idname = "shtk.separate_by_material"
    bl_label = "2. Separate By Material"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        n = separate_by_material_all()
        self.report({"INFO"}, f"Terpisah: {n} objek multi-material")
        return {"FINISHED"}


class SHTK_OT_AutoRename(Operator):
    bl_idname = "shtk.auto_rename"
    bl_label = "3. Heuristic Rename All"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        renamed, skipped = heuristic_rename_all()
        lines_r = [f"{o:<45} → {n:<22} mat:{m}" for (o, n, m) in renamed[:15]]
        lines_s = [f"{o:<35} ({v} verts, mat:{m})" for (o, m, v) in skipped[:15]]
        self.report({"INFO"}, f"Renamed {len(renamed)}, Skipped {len(skipped)}")
        print(build_report_panel("=== RENAMED ===", lines_r))
        print(build_report_panel("=== SKIPPED (rename manual!) ===", lines_s))
        return {"FINISHED"}


class SHTK_OT_ManualRenameSelected(Operator):
    bl_idname = "shtk.manual_rename"
    bl_label = "3b. Rename Selected →"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        target = context.scene.shtk_props.target_category
        sel = [o for o in context.selected_objects if o.type == "MESH"]
        if not sel:
            self.report({"WARNING"}, "Tidak ada mesh yang dipilih di Outliner!")
            return {"CANCELLED"}
        if target == "KEEP":
            self.report({"WARNING"}, "Pilih target rename terlebih dahulu!")
            return {"CANCELLED"}
        for i, m in enumerate(sel):
            name = target if i == 0 else f"{target}_{i+1:02d}"
            m.name = name
            m.data.name = name
        self.report({"INFO"}, f"{len(sel)} objek di-rename ke {target}")
        return {"FINISHED"}


class SHTK_OT_CenterReset(Operator):
    bl_idname = "shtk.center_reset"
    bl_label = "4. Reset Transform + Center"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        n = reset_transforms_and_center()
        self.report({"INFO"}, f"{n} mesh di-center dan transform di-apply")
        return {"FINISHED"}


class SHTK_OT_Decimate(Operator):
    bl_idname = "shtk.decimate"
    bl_label = "5. Decimate All"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        r = context.scene.shtk_props.decimate_ratio
        lines = []
        for name, b, a, pct in decimate_all(r):
            lines.append(f"{name:<35} {str(b):>8} → {str(a):>8} ({pct})")
        print(build_report_panel("=== DECIMATE REPORT (verts) ===", lines))
        self.report({"INFO"}, f"Decimate ratio={r} selesai. Lihat System Console.")
        return {"FINISHED"}


class SHTK_OT_Export(Operator):
    bl_idname = "shtk.export"
    bl_label = "6. Export Optimized GLB"
    bl_options = {"REGISTER"}

    def execute(self, context):
        p = context.scene.shtk_props
        ok, msg = export_glb(
            bpy.path.abspath(p.output_dir),
            p.output_filename,
            p.use_webp, p.use_draco, p.apply_modifiers
        )
        self.report({"INFO" if ok else "ERROR"}, msg)
        return {"FINISHED"} if ok else {"CANCELLED"}


class SHTK_OT_RunAll(Operator):
    bl_idname = "shtk.run_all"
    bl_label = "🔥 RUN FULL PIPELINE (Step 1-6)"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        self.report({"INFO"}, "Memulai pipeline...")
        p = context.scene.shtk_props
        ok, msg = import_glb(bpy.path.abspath(p.input_glb_path))
        if not ok:
            self.report({"ERROR"}, "GAGAL di Import: " + msg)
            return {"CANCELLED"}
        separate_by_material_all()
        heuristic_rename_all()
        reset_transforms_and_center()
        decimate_all(p.decimate_ratio)
        ok, msg = export_glb(
            bpy.path.abspath(p.output_dir), p.output_filename,
            p.use_webp, p.use_draco, p.apply_modifiers
        )
        if not ok:
            self.report({"ERROR"}, "GAGAL di Export: " + msg)
            return {"CANCELLED"}
        self.report({"INFO"}, "✅ PIPELINE SELESAI. VERIFIKASI MANUAL NAMA MESH YANG SKIPPED!")
        return {"FINISHED"}


# =================================================================
# UI PANEL
# =================================================================

class SHTK_PT_Main(Panel):
    bl_label = "👟 Shoe Configurator Toolkit"
    bl_idname = "SHTK_PT_Main"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Shoe Toolkit"
    bl_context = "objectmode"

    def draw(self, context):
        l = self.layout
        p = context.scene.shtk_props
        box = l.box()
        box.label(text="⚙️  Settings", icon="PREFERENCES")
        box.prop(p, "input_glb_path")
        box.prop(p, "output_dir")
        box.prop(p, "output_filename")
        row = box.row(align=True)
        row.prop(p, "use_webp")
        row.prop(p, "use_draco")
        row.prop(p, "apply_modifiers")
        box.prop(p, "decimate_ratio", slider=True)

        l.separator()
        l.operator(SHTK_OT_RunAll.bl_idname, icon="PLAY")

        col = l.column(align=True)
        col.label(text="— Atau jalankan step-by-step:", icon="LINENUMBERS_OFF")
        col.operator(SHTK_OT_ImportGLB.bl_idname, icon="IMPORT")
        col.operator(SHTK_OT_SeparateMaterials.bl_idname, icon="SHADERFX")
        col.operator(SHTK_OT_AutoRename.bl_idname, icon="OUTLINER_OB_FONT")

        col.separator()
        box2 = col.box()
        box2.label(text="Manual Fallback (untuk mesh yang TIDAK terdeteksi):")
        box2.label(text="  1. Klik mesh di Outliner / 3D View", icon="HAND")
        box2.label(text="  2. Pilih kategori target dibawah", icon="MESH_DATA")
        box2.prop(p, "target_category", text="Target")
        box2.operator(SHTK_OT_ManualRenameSelected.bl_idname, icon="GREASEPENCIL")

        col.separator()
        col.operator(SHTK_OT_CenterReset.bl_idname, icon="OBJECT_ORIGIN")
        col.operator(SHTK_OT_Decimate.bl_idname, icon="MOD_DECIM")
        col.operator(SHTK_OT_Export.bl_idname, icon="EXPORT")

        tip = l.box()
        tip.label(text="💡 Tips Verifikasi", icon="INFO")
        tip.scale_y = 0.9
        tip.label(text="• Buka Outliner → pastikan ada mesh_* yang diharapkan", icon="DOT")
        tip.label(text="• Klik Window → Toggle System Console untuk lihat report", icon="DOT")
        tip.label(text="• Jika Decimate terlalu agresif → undo + naikin ratio", icon="DOT")


# =================================================================
# REGISTER
# =================================================================
_CLASSES = [
    ShoeToolkitProps,
    SHTK_OT_ImportGLB,
    SHTK_OT_SeparateMaterials,
    SHTK_OT_AutoRename,
    SHTK_OT_ManualRenameSelected,
    SHTK_OT_CenterReset,
    SHTK_OT_Decimate,
    SHTK_OT_Export,
    SHTK_OT_RunAll,
    SHTK_PT_Main,
]

def register():
    for c in _CLASSES:
        bpy.utils.register_class(c)
    bpy.types.Scene.shtk_props = bpy.props.PointerProperty(type=ShoeToolkitProps)

def unregister():
    for c in reversed(_CLASSES):
        bpy.utils.unregister_class(c)
    if hasattr(bpy.types.Scene, "shtk_props"):
        del bpy.types.Scene.shtk_props

if __name__ == "__main__":
    register()
    print("✅ Shoe Configurator Toolkit terload.")
    print("   Buka 3D View → tekan N → Tab 'Shoe Toolkit'")
