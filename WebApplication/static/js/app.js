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
        console.log("temperature: ", temprature);
        console.log("humidity: ", humidity);
        console.log("ph: ", ph);
        console.log("rainfall: ", rainfall);
        // column_names = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        _dict = {
            "N": N,
            "P": P,
            "K": K,
            "temperature": temprature,
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
                // alert(data);
            }
        });
        //Reset the form here and send toster

        // $('#prediction').show()
        window.location.href = "http://localhost:5000/result";
    });
    
})