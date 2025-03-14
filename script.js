// إعداد Supabase
const supabaseUrl = 'https://tkgfmecgejjqlwlupoea.supabase.co'; // استبدل هذا برابط Supabase الخاص بك
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZtZWNnZWpqcWx3bHVwb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDcwNzMsImV4cCI6MjA1NzQ4MzA3M30.YhYFwbrzJg_c68bp_j8LyvPeC6_AJWDPjvH7FQ-3Qqw'; // استبدل هذا بالمفتاح العلني الخاص بك
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// وظيفة لاسترجاع اللاعبين من Supabase
async function fetchPlayers() {
    const { data, error } = await supabase
        .from('players')
        .select('*');

    if (error) {
        console.error('خطأ في استرجاع اللاعبين:', error);
    } else {
        displayPlayers(data);
    }
}

// وظيفة لعرض اللاعبين
function displayPlayers(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = ''; // تفريغ المحتويات السابقة

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-card'; // إضافة صنف للبطاقة
        playerDiv.innerHTML = `
            <h3>${player.name}</h3>
            <p>العمر: ${player.age}</p>
            <p>الجنسية: ${player.nationality}</p>
            <p>الأندية: ${player.clubs.join(', ')}</p>
            <p>النوع: ${player.type}</p>
            <img src="${player.image}" alt="${player.name}" class="player-image"/>
        `;
        container.appendChild(playerDiv);
    });
}

// إضافة لاعب جديد
document.getElementById('add-player-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('player-name').value;
    const age = document.getElementById('player-age').value;
    const nationality = document.getElementById('player-nationality').value;
    const clubs = document.getElementById('player-clubs').value.split(',').map(c => c.trim());
    const type = document.getElementById('player-type').value;
    const image = document.getElementById('player-image').value || "/default-image.jpg";

    const { data, error } = await supabase
        .from('players')
        .insert([{ name, age, nationality, clubs, type, image }]);

    if (error) {
        console.error('خطأ في إضافة اللاعب:', error);
    } else {
        fetchPlayers(); // تحديث قائمة اللاعبين
        document.getElementById('add-player-form').reset(); // إعادة تعيين النموذج
    }
});

// استدعاء الوظيفة عند تحميل الصفحة
window.onload = fetchPlayers;
