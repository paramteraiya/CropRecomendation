$(document).ready(function(){
    console.log("loaded!");
    // $('#submit').prop('disabled', true);
    $('#prediction').hide();
    
    $('button#submit').click(function(){
        let N = $('#N').val();
        let P = $('#P').val();
        let K = $('#K').val();
        let temprature = $('#temperature').val();
        let humidity = $('#humidity').val();
        let ph = $('#ph').val();
        let rainfall = $('#rainfall').val();
        console.log("N: ", N);
        console.log("P: ", P);
        console.log("K: ", K);
        console.log("temprature: ", temprature);
        console.log("humidity: ", humidity);
        console.log("ph: ", ph);
        console.log("rainfall: ", rainfall);

        _dict = {
            "N": N,
            "P": P,
            "K": K,
            "temprature": temprature,
            "humidity": humidity,
            "ph": ph,
            "rainfall":rainfall
        };

        $.ajax({
            url: '/predict_crop',
            type: 'POST',
            data: JSON.stringify(_dict),
            dataType: 'json',
            contentType: "json",
            success: function (data) {
                alert("Data sent");
            }
        });
        //Reset the form here and send toster

    });
    
})