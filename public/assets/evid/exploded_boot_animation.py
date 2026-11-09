"""
Exploded-view animation for leather-boot-polos-parts.glb
Run with Blender 3.6+ / 4.x:
  blender --background --python exploded_boot_animation.py

Edit INPUT_GLB and OUTPUT_MP4 below if needed.
Output: MP4 (H.264), 1920x1080, 30 FPS.
"""

import bpy
import math
import os
from mathutils import Vector

# -------------------- CONFIG --------------------
INPUT_GLB = r"D:\Project\shoesshop\public\assets\evid\leather boot 3d model.glb"

OUTPUT_MP4 = r"D:\Project\shoesshop\public\assets\evid\leather_boot_exploded_view.mp4"

FPS = 30
WIDTH = 1920
HEIGHT = 1080
DURATION_SECONDS = 18
FRAME_END = FPS * DURATION_SECONDS

# Timeline:
# 0-3s   : assembled boot rotates
# 3-6s   : components separate
# 6-13s  : exploded view hold
# 13-16s : components reassemble
# 16-18s : final assembled rotation / closing

# Separation distances are relative to the imported model's dimensions.
EXPLODE_FACTOR = 0.16
CAMERA_LENS = 55
SAMPLES = 64

# -------------------- RESET / IMPORT --------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
    # Remove unused datablocks left by the default scene.
    for block in list(datablocks):
        if block.users == 0:
            datablocks.remove(block)

if not os.path.isfile(INPUT_GLB):
    raise FileNotFoundError(f"GLB not found: {INPUT_GLB}")

bpy.ops.import_scene.gltf(filepath=INPUT_GLB)

parts = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
if not parts:
    raise RuntimeError("No mesh objects were imported from the GLB.")

# Expected mesh names in this supplied GLB:
# mesh_hardware, mesh_insole, mesh_laces, mesh_sole,
# mesh_stitching, mesh_upper, mesh_welt

# Set origins to geometry centers so each part separates around itself.
for obj in parts:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")
    obj.select_set(False)

# Calculate combined world-space bounds.
def world_bounds(objects):
    points = []
    for obj in objects:
        points.extend([obj.matrix_world @ Vector(corner) for corner in obj.bound_box])
    mins = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    maxs = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return mins, maxs

bounds_min, bounds_max = world_bounds(parts)
center = (bounds_min + bounds_max) * 0.5
size = bounds_max - bounds_min
max_dim = max(size.x, size.y, size.z)
if max_dim <= 0:
    raise RuntimeError("Imported model has invalid dimensions.")

# Root empty lets the assembled model rotate as one product.
root = bpy.data.objects.new("BOOT_ANIMATION_ROOT", None)
bpy.context.collection.objects.link(root)
root.location = center
root.empty_display_type = "PLAIN_AXES"
root.empty_display_size = max_dim * 0.15

# Parent while preserving world transforms.
for obj in parts:
    world_matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = world_matrix

# Preserve each part's starting local position and create exploded offsets.
original_locations = {obj.name: obj.location.copy() for obj in parts}

# Z is vertical in Blender. The supplied GLB names make the mapping deterministic.
# Offsets are scaled using the model size so the script works at different scales.
d = max_dim * EXPLODE_FACTOR
explode_offsets = {
    "hardware": Vector((0.00, 0.00, d * 1.55)),
    "insole":   Vector((0.00, 0.00, d * 1.20)),
    "laces":    Vector((0.00, 0.00, d * 1.75)),
    "sole":     Vector((0.00, 0.00, -d * 1.35)),
    "stitching":Vector((d * 0.90, 0.00, d * 0.15)),
    "upper":    Vector((0.00, 0.00, d * 0.35)),
    "welt":     Vector((0.00, 0.00, -d * 0.65)),
}

def component_key(obj):
    name = obj.name.lower()
    for key in explode_offsets:
        if key in name:
            return key
    return None

# Fallback for any mesh whose name does not match one of the seven known parts.
unknown_parts = [obj for obj in parts if component_key(obj) is None]
if unknown_parts:
    raise RuntimeError(
        "Unrecognized mesh name(s): " + ", ".join(o.name for o in unknown_parts)
        + ". Update component_key()/explode_offsets for this GLB."
    )

# -------------------- ANIMATION --------------------
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = FRAME_END
scene.render.fps = FPS

f_assembled_start = 1
f_explode_start = 3 * FPS
f_exploded = 6 * FPS
f_reassemble_start = 13 * FPS
f_assembled_end = 16 * FPS
f_end = FRAME_END

def key_location(obj, frame, value):
    obj.location = value
    obj.keyframe_insert(data_path="location", frame=frame, group="Exploded View")

# Keyframe all parts assembled, exploded, held, then assembled again.
for obj in parts:
    start = original_locations[obj.name]
    offset = explode_offsets[component_key(obj)]

    key_location(obj, f_assembled_start, start)
    key_location(obj, f_explode_start, start)
    key_location(obj, f_exploded, start + offset)
    key_location(obj, f_reassemble_start, start + offset)
    key_location(obj, f_assembled_end, start)
    key_location(obj, f_end, start)

# Rotate the whole shoe smoothly for a product presentation.
root.rotation_euler = (0.0, 0.0, 0.0)
root.keyframe_insert(data_path="rotation_euler", frame=f_assembled_start)
root.rotation_euler = (0.0, 0.0, math.tau)
root.keyframe_insert(data_path="rotation_euler", frame=f_end)

# Use smooth interpolation for polished motion.
for obj in parts + [root]:
    if obj.animation_data and obj.animation_data.action:
        for fcurve in obj.animation_data.action.fcurves:
            for key in fcurve.keyframe_points:
                key.interpolation = "BEZIER"
                key.handle_left_type = "AUTO_CLAMPED"
                key.handle_right_type = "AUTO_CLAMPED"

# -------------------- STUDIO SETUP --------------------
# Neutral studio background and floor.
world = scene.world or bpy.data.worlds.new("Studio World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.34, 0.32, 0.31, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.45

floor_z = bounds_min.z - max_dim * 0.08
bpy.ops.mesh.primitive_plane_add(size=max_dim * 8, location=(center.x, center.y, floor_z))
floor = bpy.context.object
floor.name = "STUDIO_FLOOR"
floor_mat = bpy.data.materials.new("Warm Grey Studio Floor")
floor_mat.diffuse_color = (0.30, 0.29, 0.28, 1)
floor_mat.use_nodes = True
floor_mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.30, 0.29, 0.28, 1)
floor_mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.78
floor.data.materials.append(floor_mat)

def add_area_light(name, location, power, size_light, color=(1.0, 0.91, 0.82)):
    data = bpy.data.lights.new(name=name, type="AREA")
    data.energy = power
    data.shape = "DISK"
    data.size = size_light
    data.color = color
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = Vector(location)
    direction = center - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj

add_area_light("Key Softbox", (center.x + max_dim * 1.8, center.y - max_dim * 2.2, center.z + max_dim * 2.4), 1800, max_dim * 1.5)
add_area_light("Fill Softbox", (center.x - max_dim * 2.0, center.y - max_dim * 0.8, center.z + max_dim * 1.1), 1100, max_dim * 1.8)
add_area_light("Rim Light", (center.x + max_dim * 0.2, center.y + max_dim * 2.0, center.z + max_dim * 1.8), 1500, max_dim * 1.2)

# Camera framing based on model size.
cam_data = bpy.data.cameras.new("Product Camera")
camera = bpy.data.objects.new("Product Camera", cam_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera.location = Vector((
    center.x + max_dim * 2.15,
    center.y - max_dim * 3.2,
    center.z + max_dim * 1.35
))
camera.data.lens = CAMERA_LENS
camera.data.sensor_width = 36
direction = center - camera.location
camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

# Aim focus at the product center.
focus = bpy.data.objects.new("Camera Focus", None)
scene.collection.objects.link(focus)
focus.location = center
focus.empty_display_type = "SPHERE"
focus.empty_display_size = max_dim * 0.03
constraint = camera.constraints.new(type="TRACK_TO")
constraint.target = focus
constraint.track_axis = "TRACK_NEGATIVE_Z"
constraint.up_axis = "UP_Y"

# -------------------- RENDER SETTINGS --------------------
scene.render.engine = "CYCLES"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True

scene.render.resolution_x = WIDTH
scene.render.resolution_y = HEIGHT
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "FFMPEG"
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "HIGH"
scene.render.ffmpeg.ffmpeg_preset = "GOOD"
scene.render.filepath = OUTPUT_MP4

scene.view_settings.view_transform = "AgX"
scene.render.image_settings.color_mode = "RGB"

# Render a clean frame at the start and produce the full animation.
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.splitext(OUTPUT_MP4)[0] + ".blend")
bpy.ops.render.render(animation=True)

print("DONE. Video saved to:", OUTPUT_MP4)
