$(document).ready(function(){
    console.log("loaded!");
    // $('#submit').prop('disabled', true);
    $('#prediction').hide();
    var response_data = "";
    var flag = 0;

    var crop_data = {
        "rice": "Rice is an edible starchy cereal grain and the grass plant (family Poaceae) by which it is produced. Roughly one-half of the world population, including virtually all of East and Southeast Asia, is wholly dependent upon rice as a staple food. 95 percent of the world’s rice crop is eaten by humans. Rice is cooked by boiling, or it can be ground into a flour. It is eaten alone and in a great variety of soups, side dishes, and main dishes in Asian, Middle Eastern, and many other cuisines.",
        "maize": "Maize is one of the most versatile emerging crops having wider adaptability under varied agro-climatic conditions. Globally, maize is known as queen of cereals because it has the highest genetic yield potential among the cereals. In India, maize is the third most important food crops after rice and wheat. According to advance estimate its production is likely to be 22.23 M Tonnes (2012-13) mainly during Kharif season which covers 80% area.",
        "mothbeans": "Moth bean, a short-day crop, is one of the most drought-resistant pulses in India. Grown at altitudes up to 1300 m above sea level, it has a wide pH range (3.5–10) and can tolerate slight salinity. While dry sandy soil is most suitable for production, moth bean can tolerate a variety of soil types.t has high antioxidant levels which reduce the risk of catching infections. *It is a rich source of magnesium, fibre and potassium which helps reduce blood pressure. *It is also considered to lower cholesterol levels."
    };
    console.log("crop_data: ", crop_data)
    console.log("crop_data.mothbeans: ", crop_data.mothbeans)

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
        
        flag = flag + 1;

        $.ajax({
            url: '/predict_crop',
            type: 'POST',
            data: JSON.stringify(_dict),
            dataType: 'json',
            contentType: "json",
            success: function (data) {
                if (flag!=2){
                    alert("Click Predict!");
                }
                response_data = data;
            }
        });
        //Reset the form here and send toster

        console.log("response_data:", response_data);
        var obj = JSON.parse(response_data);
        if(flag==2){
            $('#prediction').show()
            $('#prediction').append(`<div>`+obj.final_prediction+`</div>`);    
            
            var obj = JSON.parse(response_data);

            console.log('image_name:', obj.final_prediction);
            console.log('crop_data.image_name: ', crop_data.image_name);
            var image_name = obj.final_prediction;
            $('#part3').append(`<img src="../static/imgs/`+image_name+`.jpg" alt="">'`);
            console.log(`'`+image_name+`'`);
            $('#prediction').append(`<p id='prediction-text'>`+crop_data[image_name]+`</p>`);
        }
        });
    $('div#weather').click(function(){
        console.log("HERE");
        window.location.href = 'http://localhost:5000/weather';
    });
});