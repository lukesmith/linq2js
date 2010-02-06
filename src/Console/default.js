(function() {
    function renderDataSet(ds) {
        function getHeaders() {
            var headers = [];

            for (var n in ds[0]) {    
                headers.push(n);
            }

            return headers;
        }

        var headers = getHeaders();
        var datasetContainer = $("#dataset");
        var table = "<table><tr>";
        for (var i=0; i<headers.length; i++) {
            table += "<th>" + headers[i] + "</th>";
        }

        table += "</tr>";

        for (var i=0; i<ds.length; i++) {
            table += "<tr>";
            for (var j=0; j<headers.length; j++) {
                table += "<td>" + ds[i][headers[j]] + "</td>";
            }
            table += "</tr>";
        }

        table += "</table>";
        datasetContainer.html(table);
    }

    $(function() {
        renderDataSet(people);

        $("#execute").click(function() {
            var d = $("#console").text();
            var beginStart = new Date();
            var a = eval(d);
            $("#duration").text(new Date() - beginStart);
            displayResult(a);
        });

        function displayResult(ds) {
            if (typeof(ds.length) !== "undefined") {
                renderDataSet(ds);
            } else {
                alert(ds);
            }
        }
    });
})();