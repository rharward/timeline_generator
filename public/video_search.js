$("#").click(function () {
    var API_KEY = "Replace_this_value_with_a_real_api_key."
    var video = ''
    var videos = $("#videos")
    $("#form").submit(function (event) {
        event.preventDefault()
        //alert("form is submitted")

        var search = $("#textFieldtextArea").val()
        console.log(search)
        videoSearch(API_KEY, search, 9)
    })

    function videoSearch(key, search, maxResults) {
        console.log("in here!!!")
        $.get("https://www.googleapis.com/youtube/v3/search?key=" + key
            + "&type=video&part=snippet&maxResults=" + maxResults + "&q=" + search, function (data) {
                console.log(data)
                data.items.forEach(item => {
                    video = `

                 <iframe width="210" height="153" src="http://youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen><iframe>
                 `

                    $("#videos").prepend(video)
                });
            })
    }
})