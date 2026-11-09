import bpy
import math
import os
from mathutils import Vector

# --- KONFIGURASI ---
FILE_NAME = "leather boot 3d model.glb"
FPS = 30
ANIMATION_SECONDS = 6
TOTAL_FRAMES = FPS * ANIMATION_SECONDS
EXPLODE_DISTANCE = 2.5  
MIN_VERTICES = 100  # Batas minimal jumlah titik mesh agar dianggap komponen utama (mengabaikan serpihan)

def clear_scene():
    """Menghapus objek default di scene Blender"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def import_model(filepath):
    """Mengimpor file GLB ke dalam Blender"""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File tidak ditemukan: {filepath}")
    
    bpy.ops.import_scene.gltf(filepath=filepath)
    imported_objects = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
    return imported_objects

def setup_camera_and_lighting():
    """Membuat kamera dan pencahayaan studio dasar"""
    bpy.ops.object.camera_add(location=(3.5, -3.5, 2.5), rotation=(math.radians(65), 0, math.radians(45)))
    camera = bpy.context.active_object
    camera.name = "Animation_Camera"
    bpy.context.scene.camera = camera
    
    bpy.ops.object.light_add(type='AREA', location=(4, -4, 5))
    light1 = bpy.context.active_object
    light1.data.energy = 500.0
    light1.data.size = 5.0

    bpy.ops.object.light_add(type='AREA', location=(-4, 2, 3))
    light2 = bpy.context.active_object
    light2.data.energy = 200.0

def main():
    clear_scene()
    setup_camera_and_lighting()
    
    script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
    file_path = os.path.join(script_dir, FILE_NAME)
    
    print(f"Mengimpor model dari: {file_path}")
    imported_mesh_objs = import_model(file_path)
    
    if not imported_mesh_objs:
        print("Error: Tidak ada mesh yang ditemukan pada file yang diimpor.")
        return

    bpy.ops.object.select_all(action='DESELECT')
    for obj in imported_mesh_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = imported_mesh_objs[0]
    
    if len(imported_mesh_objs) > 1:
        bpy.ops.object.join()
    
    main_obj = bpy.context.active_object
    main_obj.name = "Boot_Master"

    # Pisahkan mesh berdasarkan bagian yang terhubung (Loose Parts)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')

    all_parts = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    
    # FILTER: Hapus bagian serpihan kecil, hanya ambil komponen utama berdasarkan jumlah vertex
    parts = []
    for obj in all_parts:
        if len(obj.data.vertices) >= MIN_VERTICES:
            parts.append(obj)
        else:
            bpy.data.objects.remove(obj, do_unlink=True)

    print(f"Model disaring. Total komponen utama yang dianimasikan: {len(parts)} bagian.")

    if not parts:
        print("Error: Tidak ada bagian yang lolos filter. Coba kurangi nilai MIN_VERTICES.")
        return

    # Hitung pusat keseluruhan model sepatu
    total_loc = Vector((0, 0, 0))
    for obj in parts:
        total_loc += obj.location
    model_center = total_loc / len(parts)

    max_dim = 1.0
    for obj in parts:
        for dim in obj.dimensions:
            if dim > max_dim:
                max_dim = dim

    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = TOTAL_FRAMES
    scene.render.fps = FPS

    # Atur Animasi Keyframe untuk setiap komponen utama
    for i, obj in enumerate(parts):
        direction = obj.location - model_center
        if direction.length == 0:
            direction = Vector((0.0, 0.0, 1.0))
        direction.normalize()

        distance = max_dim * EXPLODE_DISTANCE * (0.8 + (i % 3) * 0.2)
        exploded_location = obj.location + (direction * distance)
        original_location = obj.location.copy()

        # Frame 1: Posisi Utuh
        obj.location = original_location
        obj.keyframe_insert(data_path="location", frame=1)

        # Frame Terpencar
        obj.location = exploded_location
        obj.keyframe_insert(data_path="location", frame=int(TOTAL_FRAMES * 0.25))
        obj.keyframe_insert(data_path="location", frame=int(TOTAL_FRAMES * 0.60))

        # Frame Akhir: Kembali Menyatu
        obj.location = original_location
        obj.keyframe_insert(data_path="location", frame=TOTAL_FRAMES)

    print("Setup animasi selesai dengan bersih!")

if __name__ == "__main__":
    main()