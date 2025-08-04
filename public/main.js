document.getElementById("year").textContent = new Date().getFullYear();
let rotation = 0;
const addJokeBtn = document.getElementById("addJoke");
$('#addJoke').click(()=>{
        $('#newJoke').val('');
        $('#author').val('');
        $('.addJokePopup').toggle(200).css('display', 'flex');
})

$('#sendJoke').click(()=>{
    const userJoke = $('#newJoke').val();
    const author = $('#author').val();
    
    axios.post('/jokes', {joke: userJoke, author: author})
        .then(res => {
            // $('.jokeContainer').text(res.data.joke);
            res.status(201);
            alert('Відправлено');
        })
        .catch(err => {
            console.log(err);
        })
    
    $('.addJokePopup').toggle(200).css('display', 'none');
})

$('.closePopup').click(() => {
    $('.addJokePopup').fadeOut(200);
});

$(document).on('keydown', (e) => {
    if (e.key === 'Escape') {
        $('.addJokePopup').fadeOut(200);
    }
});


$('#getJoke').click(()=>{
    axios.get('/randomJoke')
        .then(res => {
            $('.jokeContainer').text(res.data.joke);
        })
        .catch(err => {
            console.log(err);
        })
})  


function showDefaultJoke() {
    axios.get('/randomJoke')
        .then(res => {
            $('.jokeContainer').text(res.data.joke);
        })
        .catch(err => {
            console.log(err);
        })
}
showDefaultJoke();


function fetchJokeCount() {
    axios.get('/jokes/count')
        .then(res => {
            $('.jokeCount').text(`к. жартів: ${res.data.count}`);
        })
        .catch(err => {
            console.error('Помилка при отриманні кількості жартів', err);
        });
}

fetchJokeCount();
