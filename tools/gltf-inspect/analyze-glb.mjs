// tools/gltf-inspect/analyze-glb.mjs
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

const GLB_PATH_1 = process.argv[2] ?? 'D:\\Project\\shoesshop\\3D Assets\\leather boot 3d model.glb';
const GLB_PATH_2 = process.argv[3] ?? 'D:\\Project\\shoesshop\\3D Assets\\chelsea boot 3d model.glb';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

function analyzeScene(scene, label) {
  console.log(`\n${'='.repeat(72)}`);
  console.log(`ANALISIS: ${label}`);
  console.log(`FILE: ${path.basename(label === 'MODEL 1' ? GLB_PATH_1 : GLB_PATH_2)}`);
  console.log(`='.repeat(72)}`);

  const stats = {
    totalMeshes: 0,
    totalMaterials: 0,
    totalVertices: 0,
    totalTriangles: 0,
    meshList: [],
    materialSet: new Map(),
  };

  scene.traverse((obj) => {
    if (obj.isMesh) {
      stats.totalMeshes++;
      const geo = obj.geometry;
      const mat = Array.isArray(obj.material) ? obj.material : [obj.material];
      const posCount = geo.attributes.position ? geo.attributes.position.count : 0;
      const triCount = geo.index ? geo.index.count / 3 : posCount / 3;
      stats.totalVertices += posCount;
      stats.totalTriangles += Math.round(triCount);

      const matNames = mat.map((m, i) => {
        const key = m.name || `Mat_${i}_${Math.round(m.color?.r*255)}_${Math.round(m.color?.g*255)}_${Math.round(m.color?.b*255)}`;
        if (!stats.materialSet.has(key)) {
          stats.materialSet.set(key, {
            name: key,
            type: m.type,
            color: m.color ? `rgb(${Math.round(m.color.r*255)},${Math.round(m.color.g*255)},${Math.round(m.color.b*255)})` : '-',
            metalness: m.metalness ?? 'n/a',
            roughness: m.roughness ?? 'n/a',
            map: !!m.map,
            normalMap: !!m.normalMap,
            roughnessMap: !!m.roughnessMap,
            metalnessMap: !!m.metalnessMap,
            aoMap: !!m.aoMap,
          });
        }
        return key;
      });
      stats.materialSet.size; stats.totalMaterials = stats.materialSet.size;

      stats.meshList.push({
        name: obj.name || `UnnamedMesh_${stats.totalMeshes}`,
        vertices: posCount.toLocaleString(),
        triangles: Math.round(triCount).toLocaleString(),
        parent: obj.parent ? obj.parent.name : '-',
        materials: matNames,
        visible: obj.visible,
      });
    }
  });

  console.log(`\n📊 OVERALL STATISTICS`);
  console.log(`  • Total Mesh Objects        : ${stats.totalMeshes}`);
  console.log(`  • Total Unique Materials    : ${stats.totalMaterials}`);
  console.log(`  • Total Vertices            : ${stats.totalVertices.toLocaleString()}`);
  console.log(`  • Total Triangles (Faces)   : ${stats.totalTriangles.toLocaleString()}`);
  console.log(`  • Size estimate (uncompressed): ~${Math.round(stats.totalTriangles * 60 / 1024 / 1024)} MB raw buffer`);

  console.log(`\n🪵  DAFTAR SEMUA MESH:`);
  console.log(`  No.  ${'Mesh Name'.padEnd(38)}  Verts     Tris      Materi  Parent`);
  console.log(`  ${'─'.repeat(100)}`);
  stats.meshList.forEach((m, i) => {
    console.log(`  ${String(i+1).padStart(3)}.  ${m.name.padEnd(38).slice(0,38)}  ${String(m.vertices).padStart(8)}  ${String(m.triangles).padStart(8)}  ${m.materials.length} slot  ${m.parent}`);
  });

  console.log(`\n🎨  DAFTAR SEMUA MATERIAL UNIK:`);
  console.log(`  ${'─'.repeat(120)}`);
  console.log(`  ${'No.'.padEnd(4)} ${'Name'.padEnd(40)} ${'Color'.padEnd(24)} ${'Rough'.padEnd(6)} ${'Met'.padEnd(5)} ${'Maps'.padEnd(22)}`);
  console.log(`  ${'─'.repeat(120)}`);
  [...stats.materialSet.values()].forEach((m, i) => {
    const maps = [
      m.map ? 'Col' : '',
      m.normalMap ? 'NRM' : '',
      m.roughnessMap ? 'Rgh' : '',
      m.metalnessMap ? 'Met' : '',
      m.aoMap ? 'AO' : '',
    ].filter(Boolean).join('+') || '-';
    console.log(`  ${String(i+1).padStart(3)}. ${m.name.padEnd(40).slice(0,40)} ${String(m.color).padEnd(24)} ${String(m.roughness).padEnd(6)} ${String(m.metalness).padEnd(5)} ${maps}`);
  });

  console.log(`\n🔍 REKOMENDASI PEMISAHAN MESH:`);
  if (stats.totalMeshes >= 5) {
    console.log(`  ✅ Model SUDAH punya multiple mesh (${stats.totalMeshes})! Tinggal RENAME saja sesuai konvensi.`);
    console.log(`     Contoh: mesh paling bawah kemungkinan adalah mesh_sole, yang warna kulit = mesh_upper, dll.`);
  } else if (stats.totalMeshes === 1) {
    console.log(`  ⚠️  Hanya ADA 1 mesh BESAR. Perlu DIPISAHKAN (P key > Selection) ATAU SEPARATE BY MATERIAL (jika material > 1).`);
    if (stats.totalMaterials > 1) {
      console.log(`  🎯 STRATEGI TERCEPAT: Blender > Edit Mode > Select All > P > Separate By Material.`);
      console.log(`     Hasilnya akan jadi ${stats.totalMaterials} mesh (1 per material slot). Tinggal rename!`);
    } else {
      console.log(`  🎯 Material cuma 1. Harus pisah MANUAL: select face by area, tekan P > Selection.`);
    }
  } else {
    console.log(`  🔄 ${stats.totalMeshes} meshes, ${stats.totalMaterials} materials. Campuran strategi.`);
  }

  return stats;
}

async function loadAndAnalyze(glbPath, label) {
  const buffer = fs.readFileSync(glbPath).buffer;
  return new Promise((resolve, reject) => {
    loader.parse(buffer, '', (gltf) => {
      const s = analyzeScene(gltf.scene, label);
      resolve(s);
    }, reject);
  });
}

(async () => {
  console.log('🔬 THREE.js GLB Structure Analyzer');
  console.log('   Digunakan untuk memetakan strategi pemisahan mesh di Blender\n');
  try {
    const s1 = await loadAndAnalyze(GLB_PATH_1, 'MODEL 1 (Leather Boot)');
    const s2 = await loadAndAnalyze(GLB_PATH_2, 'MODEL 2 (Chelsea Boot)');
    console.log('\n✅ Analisis selesai. Gunakan hasil di atas untuk eksekusi langkah Blender.');
  } catch (e) {
    console.error('❌ Error parse GLB:', e.message);
    process.exit(1);
  }
})();
