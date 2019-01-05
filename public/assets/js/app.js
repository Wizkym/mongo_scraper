$(document).ready(() => {
    // Mobile sidenav functionality
    $('.sidenav').sidenav();
});

$(document).on('click', '#note-btn', function () {
    event.preventDefault();
    const thisId = $(this).data('id');
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $('#title').val().trim(),
            // Value taken from body textarea
            body: $('#body').val().trim()
        }
    })
    .then(function (data) {
        console.log('YESS');
    });

    // Remove the values entered in the input and textarea
    $("#title").val("");
    $("#body").val("");
});
