const SUPABASE_URL = 'https://tkgfmecgejjqlwlupoea.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZtZWNnZWpqcWx3bHVwb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDcwNzMsImV4cCI6MjA1NzQ4MzA3M30.YhYFwbrzJg_c68bp_j8LyvPeC6_AJWDPjvH7FQ-3Qqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة رفع الصور إلى التخزين
async function uploadImage(file, folder) {
    const { data, error } = await supabase.storage
        .from('images')
        .upload(`${folder}/${Date.now()}_${file.name}`, file);
    
    if (error) throw error;
    return data.path;
}

// دالة إضافة لاعب
async function addPlayer() {
    try {
        const playerData = {
            name: document.getElementById('playerName').value,
            age: parseInt(document.getElementById('playerAge').value),
            height: parseFloat(document.getElementById('playerHeight').value),
            club_jersey_number: parseInt(document.getElementById('clubJersey').value),
            national_jersey_number: parseInt(document.getElementById('nationalJersey').value),
        };

        // رفع صورة اللاعب
        const photoFile = document.getElementById('playerPhoto').files[0];
        if (photoFile) {
            const photoPath = await uploadImage(photoFile, 'players');
            playerData.player_image = photoPath;
        }

        // إضافة اللاعب إلى قاعدة البيانات
        const { error } = await supabase
            .from('players')
            .insert([playerData]);

        if (error) throw error;
        alert('تمت إضافة اللاعب بنجاح!');
        loadPlayers(); // تحديث القائمة
    } catch (error) {
        console.error('حدث خطأ:', error);
        alert('فشلت العملية!');
    }
}

// دالة عرض اللاعبين
async function loadPlayers() {
    const { data: players, error } = await supabase
        .from('players')
        .select('*');

    if (error) {
        console.error('حدث خطأ:', error);
        return;
    }

    const playersList = document.getElementById('playersList');
    playersList.innerHTML = players.map(player => `
        <div class="player-card">
            <h3>${player.name}</h3>
            <p>العمر: ${player.age}</p>
            <p>الطول: ${player.height}m</p>
            <p>رقم القميص (النادي): ${player.club_jersey_number}</p>
            ${player.player_image ? `<img src="${supabase.storage.from('images').getPublicUrl(player.player_image).data.publicUrl}">` : ''}
        </div>
    `).join('');
}

// تحميل اللاعبين عند فتح الصفحة
window.onload = loadPlayers;
