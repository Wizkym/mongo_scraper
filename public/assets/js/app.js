$(document).ready(() => {
    // Mobile sidenav functionality
    $('.sidenav').sidenav();
});

$(document).on('click', '#note-btn', function () {
    event.preventDefault();
    const thisId = $(this).data('id');
    $.ajax({
        method: "POST",
        url: "/comments/" + thisId,
        data: {
            // Value taken from title input
            title: $('#title').val().trim(),
            // Value taken from body textarea
            body: $('#body').val().trim(),
            // Article id
            article: thisId
        }
    })
    .then(function (data) {
        const commentsCard = $("#comments-div");
        let newComment = `<div class="col s12">
                <div class="card horizontal">
                    <div class="card-stacked">
                        <div class="card-content">
                            <h6>${data.title}</h6>
                            <p><i>${data.body}</i></p>
                        </div>
                    </div>
                </div>
            </div>`;
        commentsCard.append(newComment);
    });

    // Remove the values entered in the input and textarea
    $("#title").val("");
    $("#body").val("");
});
