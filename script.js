// إعداد Supabase
const SUPABASE_URL = 'https://tkgfmecgejjqlwlupoea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZtZWNnZWpqcWx3bHVwb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDcwNzMsImV4cCI6MjA1NzQ4MzA3M30.YhYFwbrzJg_c68bp_j8LyvPeC6_AJWDPjvH7FQ-3Qqw';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة رفع الصور إلى Supabase
async function uploadImage(file, playerId) {
    const filePath = `players/${playerId}.png`;
    const { data, error } = await supabase.storage.from('images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
    });

    if (error) {
        console.error('خطأ في رفع الصورة:', error.message);
        return null;
    }

    return filePath;
}

// دالة جلب رابط الصورة
async function getImageUrl(path) {
    if (!path) return null;
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
}

// دالة إضافة لاعب جديد
async function addPlayer(event) {
    event.preventDefault();

    const name = document.getElementById('player-name').value;
    const age = document.getElementById('player-age').value;
    const height = document.getElementById('player-height').value;
    const clubJersey = document.getElementById('club-jersey-number').value;
    const nationalJersey = document.getElementById('national-jersey-number').value;
    const file = document.getElementById('player-image').files[0];

    if (!name || !age || !file) {
        alert('يرجى إدخال جميع البيانات المطلوبة.');
        return;
    }

    const playerId = crypto.randomUUID(); // إنشاء UUID فريد

    // رفع الصورة والحصول على المسار
    const imagePath = await uploadImage(file, playerId);
    if (!imagePath) return;

    // إدخال بيانات اللاعب في قاعدة البيانات
    const { error } = await supabase.from('players').insert([
        {
            id: playerId,
            name,
            age,
            height,
            club_jersey_number: clubJersey,
            national_jersey_number: nationalJersey,
            player_image: imagePath
        }
    ]);

    if (error) {
        console.error('خطأ في إدخال بيانات اللاعب:', error.message);
    } else {
        alert('تمت إضافة اللاعب بنجاح');
        fetchPlayers(); // تحديث قائمة اللاعبين
    }
}

// دالة جلب جميع اللاعبين وعرضهم
async function fetchPlayers() {
    const { data: players, error } = await supabase.from('players').select('*');
    if (error) {
        console.error('خطأ في جلب اللاعبين:', error.message);
        return;
    }

    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';

    for (const player of players) {
        const imageUrl = await getImageUrl(player.player_image);
        playersList.innerHTML += `
            <div class="player-card">
                <img src="${imageUrl}" alt="${player.name}" width="100">
                <h3>${player.name}</h3>
                <p>العمر: ${player.age}</p>
                <p>الطول: ${player.height} م</p>
                <p>رقم القميص (النادي): ${player.club_jersey_number || 'غير متوفر'}</p>
                <p>رقم القميص (المنتخب): ${player.national_jersey_number || 'غير متوفر'}</p>
            </div>
        `;
    }
}

// تحميل اللاعبين عند فتح الصفحة
document.getElementById('player-form').addEventListener('submit', addPlayer);
fetchPlayers();
