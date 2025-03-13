const SUPABASE_URL = 'https://tkgfmecgejjqlwlupoea.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZtZWNnZWpqcWx3bHVwb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDcwNzMsImV4cCI6MjA1NzQ4MzA3M30.YhYFwbrzJg_c68bp_j8LyvPeC6_AJWDPjvH7FQ-3Qqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة لتحميل الصور
async function uploadImage(file, folder) {
    const { data, error } = await supabase.storage
        .from('images')
        .upload(`${folder}/${Date.now()}_${file.name}`, file);

    if (error) throw error;
    return data.path;
}

// إضافة لاعب جديد
async function addPlayer() {
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);

    try {
        // رفع صورة الجنسية إذا أضيفت
        const nationalityFile = document.getElementById('newNationality').files[0];
        let nationalityId;

        if (nationalityFile) {
            const imagePath = await uploadImage(nationalityFile, 'nationalities');
            const { data } = await supabase
                .from('nationalities')
                .insert([{ name: 'جنسية جديدة', flag_image: imagePath }])
                .select();
            nationalityId = data[0].id;
        }

        // إضافة اللاعب
        const { error } = await supabase
            .from('players')
            .insert([{ 
                name, 
                age,
                nationality_id: nationalityId 
            }]);

        if (error) throw error;
        alert('تمت الإضافة!');
    } catch (error) {
        console.error('Error:', error);
    }
}

// عرض اللاعبين
async function loadPlayers() {
    const { data, error } = await supabase
        .from('players')
        .select('*, nationalities(flag_image)');

    if (error) return;
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = data.map(player => `
        <div class="player-card">
            <h3>${player.name}</h3>
            <p>العمر: ${player.age}</p>
            <img src="${supabase.storage.from('images').getPublicUrl(player.nationalities.flag_image).data.publicUrl}" class="player-image">
            <button onclick="deletePlayer('${player.id}')">حذف</button>
        </div>
    `).join('');
}

// حذف لاعب
async function deletePlayer(id) {
    const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

    if (error) return;
    loadPlayers();
}

// تشغيل عند تحميل الصفحة
window.onload = () => loadPlayers();
