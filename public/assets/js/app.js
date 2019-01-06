$(document).ready(() => {
    // Mobile sidenav functionality
    $('.sidenav').sidenav();
});

// Expand document on click
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
    .then((data) => {
        const commentsCard = $("#comments-div");
        let newComment =
            `<div class="col s12">
                <div class="card horizontal">
                    <div class="card-stacked">
                        <div class="card-content">
                            <button id="comment-btn" data-value=${ data._id } 
                            class="btn-small halfway-fab waves-effect waves-light red right">
                            <i class="material-icons">delete</i>
                            </button>
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

// Delete Note
$(document).on('click', '#comment-btn', function () {
    event.preventDefault();
    const thisId = $(this).data('value');

    $.ajax({
        method: "DELETE",
        url: "/comments/" + thisId
    })
    .then((data) => {
        $(this).parent('div').remove();
    })
});
