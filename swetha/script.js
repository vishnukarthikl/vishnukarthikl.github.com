messageIndex = 0;

function showMessage() {
    var messages = ['You + Me = ♥', 'd(♥)/dt = ♥', '( ^ ᴗ ^ ) (〃‿〃✿)', 'I love you', ' (˶^ з^(〃‿〃✿)', 'netflix and chill?'];
    $('#spinner').removeClass('d-none');
    $('#secret-message').addClass('d-none');
    setTimeout(function () {
        $('#spinner').addClass('d-none');
        $('#secret-message').removeClass('d-none');
        $('#secret-message').html(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
    }, 1500);

}
