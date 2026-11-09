"""
Exploded-view animation for a GLB shoe model.
Compatible target: Blender 5.x (also expected to work on Blender 4.x).

Place this script in the SAME folder as the GLB, then run:
  blender --background --python exploded_boot_animation.py

The script:
- Finds the GLB beside this .py file automatically.
- Imports the GLB.
- If Blender imports it as one mesh, separates disconnected geometry
  into loose parts automatically.
- Does not depend on mesh object names.
- Animates the parts moving outward, then reassembling.
- Saves an MP4 and a .blend project beside this script.
"""

import bpy
import math
import os
from mathutils import Vector

# -------------------- CONFIG --------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# The GLB must be in the same folder as this script.
INPUT_GLB = os.path.join(SCRIPT_DIR, "leather boot 3d model.glb")
OUTPUT_MP4 = os.path.join(SCRIPT_DIR, "leather_boot_exploded_view.mp4")
OUTPUT_BLEND = os.path.join(SCRIPT_DIR, "leather_boot_exploded_view.blend")

FPS = 30
WIDTH = 1920
HEIGHT = 1080
DURATION_SECONDS = 18
FRAME_END = FPS * DURATION_SECONDS

EXPLODE_DISTANCE = 0.24  # Multiplier of the model's largest dimension
CAMERA_LENS = 50
CYCLES_SAMPLES = 32

# -------------------- RESET SCENE --------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

if not os.path.isfile(INPUT_GLB):
    raise FileNotFoundError(
        "GLB tidak ditemukan.\n"
        f"Script folder : {SCRIPT_DIR}\n"
        f"GLB expected  : {INPUT_GLB}\n"
        "Letakkan leather-boot-polos-parts.glb satu folder dengan script."
    )

# -------------------- IMPORT GLB --------------------
bpy.ops.import_scene.gltf(filepath=INPUT_GLB)
imported_meshes = [
    obj for obj in bpy.context.scene.objects
    if obj.type == "MESH"
]

if not imported_meshes:
    raise RuntimeError("GLB berhasil dibuka, tetapi tidak ada objek MESH.")

print("\n========== GLB IMPORT REPORT ==========")
print("Imported mesh objects:", len(imported_meshes))
for obj in imported_meshes:
    print(
        f"- {obj.name} | vertices={len(obj.data.vertices)} "
        f"| polygons={len(obj.data.polygons)}"
    )
print("=======================================\n")

# Blender may import a GLB containing several disconnected components
# as one mesh object. Separate those components without relying on names.
if len(imported_meshes) == 1:
    source_obj = imported_meshes[0]
    bpy.ops.object.select_all(action="DESELECT")
    source_obj.select_set(True)
    bpy.context.view_layer.objects.active = source_obj

    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")

# Refresh list after possible separation.
parts = [
    obj for obj in bpy.context.scene.objects
    if obj.type == "MESH"
]

if not parts:
    raise RuntimeError("Tidak ada mesh yang bisa dianimasikan.")

print("Mesh parts available for animation:", len(parts))
for obj in parts:
    print(
        f"- {obj.name} | vertices={len(obj.data.vertices)} "
        f"| dimensions=({obj.dimensions.x:.4f}, "
        f"{obj.dimensions.y:.4f}, {obj.dimensions.z:.4f})"
    )

if len(parts) == 1:
    print(
        "WARNING: Model hanya memiliki satu komponen geometri terhubung. "
        "Exploded animation antar-komponen tidak dapat dibuat dari mesh ini."
    )

# -------------------- ORIGINS AND BOUNDS --------------------
# Set each object's origin to its geometry while preserving its visual position.
for obj in parts:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")
    obj.select_set(False)


def get_world_bounds(objects):
    corners = []
    for obj in objects:
        corners.extend(
            obj.matrix_world @ Vector(corner)
            for corner in obj.bound_box
        )

    minimum = Vector((
        min(p.x for p in corners),
        min(p.y for p in corners),
        min(p.z for p in corners),
    ))
    maximum = Vector((
        max(p.x for p in corners),
        max(p.y for p in corners),
        max(p.z for p in corners),
    ))
    return minimum, maximum


bounds_min, bounds_max = get_world_bounds(parts)
model_center = (bounds_min + bounds_max) * 0.5
model_size = bounds_max - bounds_min
max_dim = max(model_size.x, model_size.y, model_size.z)

if max_dim <= 0:
    raise RuntimeError("Dimensi model tidak valid.")

# Store each component's world-space center before parenting.
part_centers = {}
for obj in parts:
    world_corners = [
        obj.matrix_world @ Vector(corner)
        for corner in obj.bound_box
    ]
    part_centers[obj.name] = sum(world_corners, Vector()) / len(world_corners)

# -------------------- ROOT CONTROL --------------------
root = bpy.data.objects.new("BOOT_ANIMATION_ROOT", None)
bpy.context.collection.objects.link(root)
root.location = model_center
root.empty_display_type = "PLAIN_AXES"
root.empty_display_size = max_dim * 0.12

# Parent all parts while preserving their world transforms.
for obj in parts:
    world_matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = world_matrix

original_locations = {
    obj.name: obj.location.copy()
    for obj in parts
}

# -------------------- EXPLODED OFFSETS --------------------
# Direction is calculated from each component's position relative to
# the shoe center. This works with generated mesh names such as Tripo nodes.
explode_offsets = {}
distance = max_dim * EXPLODE_DISTANCE

for index, obj in enumerate(parts):
    direction = part_centers[obj.name] - model_center

    if direction.length < max_dim * 0.015:
        # Deterministic fallback for a component located near the model center.
        angle = (2.0 * math.pi * index) / max(1, len(parts))
        direction = Vector((math.cos(angle), math.sin(angle), 0.45))

    direction.normalize()

    # Add a small alternating vertical spread so overlapping parts are visible.
    vertical_spread = ((index % 3) - 1) * max_dim * 0.035
    offset = direction * distance
    offset.z += vertical_spread
    explode_offsets[obj.name] = offset

# -------------------- ANIMATION --------------------
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = FRAME_END
scene.render.fps = FPS
scene.render.fps_base = 1.0

# Timeline:
# 0-3s   assembled product
# 3-6s   parts separate
# 6-13s  exploded view
# 13-16s parts reassemble
# 16-18s final assembled view

F_ASSEMBLED = 1
F_EXPLODE_START = 3 * FPS
F_EXPLODED = 6 * FPS
F_REASSEMBLE_START = 13 * FPS
F_REASSEMBLED = 16 * FPS
F_END = FRAME_END


def insert_location_key(obj, frame, location):
    obj.location = location
    obj.keyframe_insert(
        data_path="location",
        frame=frame,
        group="Exploded View",
    )


for obj in parts:
    assembled = original_locations[obj.name]
    exploded = assembled + explode_offsets[obj.name]

    insert_location_key(obj, F_ASSEMBLED, assembled)
    insert_location_key(obj, F_EXPLODE_START, assembled)
    insert_location_key(obj, F_EXPLODED, exploded)
    insert_location_key(obj, F_REASSEMBLE_START, exploded)
    insert_location_key(obj, F_REASSEMBLED, assembled)
    insert_location_key(obj, F_END, assembled)

# Full rotation for product presentation.
root.rotation_euler = (0.0, 0.0, 0.0)
root.keyframe_insert(data_path="rotation_euler", frame=F_ASSEMBLED)
root.rotation_euler = (0.0, 0.0, math.tau)
root.keyframe_insert(data_path="rotation_euler", frame=F_END)

# Smooth keyframe interpolation.
for animated_obj in parts + [root]:
    animation_data = animated_obj.animation_data
    action = animation_data.action if animation_data else None
    if not action:
        continue

    # Blender 4/5 action compatibility.
    try:
        curves = action.fcurves
    except Exception:
        curves = []

    for curve in curves:
        for key in curve.keyframe_points:
            key.interpolation = "BEZIER"
            key.handle_left_type = "AUTO_CLAMPED"
            key.handle_right_type = "AUTO_CLAMPED"

# -------------------- STUDIO WORLD --------------------
world = scene.world or bpy.data.worlds.new("Studio World")
scene.world = world
world.use_nodes = True
background = world.node_tree.nodes.get("Background")
if background:
    background.inputs["Color"].default_value = (0.34, 0.32, 0.31, 1)
    background.inputs["Strength"].default_value = 0.45

# Studio floor.
floor_z = bounds_min.z - max_dim * 0.10
bpy.ops.mesh.primitive_plane_add(
    size=max_dim * 8,
    location=(model_center.x, model_center.y, floor_z),
)
floor = bpy.context.object
floor.name = "STUDIO_FLOOR"

floor_material = bpy.data.materials.new("Warm Grey Studio Floor")
floor_material.diffuse_color = (0.30, 0.29, 0.28, 1)
floor_material.use_nodes = True
floor_bsdf = floor_material.node_tree.nodes.get("Principled BSDF")
if floor_bsdf:
    floor_bsdf.inputs["Base Color"].default_value = (0.30, 0.29, 0.28, 1)
    floor_bsdf.inputs["Roughness"].default_value = 0.78
floor.data.materials.append(floor_material)


def add_area_light(name, location, power, light_size):
    light_data = bpy.data.lights.new(name=name, type="AREA")
    light_data.energy = power
    light_data.shape = "DISK"
    light_data.size = light_size

    light_obj = bpy.data.objects.new(name, light_data)
    scene.collection.objects.link(light_obj)
    light_obj.location = Vector(location)

    direction = model_center - light_obj.location
    light_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return light_obj


add_area_light(
    "Key Softbox",
    (model_center.x + max_dim * 1.8,
     model_center.y - max_dim * 2.2,
     model_center.z + max_dim * 2.4),
    1800,
    max_dim * 1.5,
)
add_area_light(
    "Fill Softbox",
    (model_center.x - max_dim * 2.0,
     model_center.y - max_dim * 0.8,
     model_center.z + max_dim * 1.1),
    1100,
    max_dim * 1.8,
)
add_area_light(
    "Rim Light",
    (model_center.x + max_dim * 0.2,
     model_center.y + max_dim * 2.0,
     model_center.z + max_dim * 1.8),
    1500,
    max_dim * 1.2,
)

# -------------------- CAMERA --------------------
camera_data = bpy.data.cameras.new("Product Camera")
camera = bpy.data.objects.new("Product Camera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera

camera.location = Vector((
    model_center.x + max_dim * 2.8,
    model_center.y - max_dim * 4.0,
    model_center.z + max_dim * 2.0,
))
camera.data.lens = CAMERA_LENS
camera.data.sensor_width = 36

focus = bpy.data.objects.new("Camera Focus", None)
scene.collection.objects.link(focus)
focus.location = model_center
focus.empty_display_type = "SPHERE"
focus.empty_display_size = max_dim * 0.025

track = camera.constraints.new(type="TRACK_TO")
track.target = focus
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

# -------------------- RENDER SETTINGS --------------------
scene.render.engine = "CYCLES"
scene.cycles.samples = CYCLES_SAMPLES
scene.cycles.use_denoising = True

scene.render.resolution_x = WIDTH
scene.render.resolution_y = HEIGHT
scene.render.resolution_percentage = 100

scene.render.image_settings.media_type = "VIDEO"
scene.render.image_settings.file_format = "FFMPEG"
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "HIGH"
scene.render.ffmpeg.ffmpeg_preset = "GOOD"
scene.render.filepath = OUTPUT_MP4

scene.view_settings.view_transform = "AgX"
scene.render.image_settings.color_mode = "RGB"

# Save project before rendering, then render animation.
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_BLEND)

print("\n========== RENDER ==========")
print("Input GLB :", INPUT_GLB)
print("Output MP4:", OUTPUT_MP4)
print("Parts     :", len(parts))
print("Frames    :", FRAME_END)
print("============================\n")

bpy.ops.render.render(animation=True)

print("\nRENDER COMPLETE:", OUTPUT_MP4)
