(function() {
    function renderDataSet(ds, container) {
        function getHeaders() {
            var headers = [];

            for (var n in ds[0]) {    
                headers.push(n);
            }

            return headers;
        }

        var headers = getHeaders();
        var table = "<table><tr>";
        for (var i=0; i<headers.length; i++) {
            table += "<th>" + headers[i] + "</th>";
        }

        table += "</tr>";

        for (var i=0; i<ds.length; i++) {
            table += "<tr>";

            if (typeof(ds[i]) === "string") {
                table += "<td>" + ds[i] + "</td>";
            } else {
                for (var j=0; j<headers.length; j++) {
                    var value = ds[i][headers[j]];

                    if (typeof(value.length) !== "undefined" && typeof(value) !== "string") {
                        value = "Array containing " + value.length + " elements";
                    } else if (typeof(value.expressions) !== "undefined") {
                        value = "Enumerable containing " + value.elements.length + " items";
                    }

                    table += "<td>" + value + "</td>";
                }
            }
            table += "</tr>";
        }

        table += "</table>";
        container.html(table);
    }

    $(function() {
        renderDataSet(people, $("#dataset"));

        $("#execute").click(function() {
            var d = $("#console").text();
            var beginStart = new Date();
            var a = eval(d);
            $("#duration").text(new Date() - beginStart);
            displayResult(a);
        });

        function displayResult(ds) {
            if (typeof(ds.length) !== "undefined") {
                renderDataSet(ds, $("#dataset"));
            } else if (typeof(ds) === "number" || typeof(ds) === "string") {
                alert(ds);
            } else {
                var r = ds.toArray();
                if (typeof(r[0].values) !== "undefined") {
                    var el = $("#dataset");
                    el.html("");
                    ds.each(function(item) {
                        var t = $("<div></div>");
                        renderDataSet(item.values.toArray(), t);
                        el.append("<br/><label>" + item.key + "</label>");
                        el.append(t);
                    });
                } else {
                    if (typeof(ds.expressions) !== "undefined") {
                        renderDataSet(ds.toArray(), $("#dataset"));
                    }
                }
            }
        }

        $("#Over40").click(function() {
            $("#console").text("$e(people)\n\r" +
                               "    .where(function(x) { return x.age > 40; })\n\r" +
                               "    .toArray()");
        });
        
        $("#grouping").click(function() {
            $("#console").text("$e(people)\n\r" +
                               "    .where(function(x) { return x.age < 39; })\n\r" +
                               "    .groupBy(function(x) { return x.lastname; })\n\r" +
                               "    .orderBy(function(x) { return x.key; })\n\r" +
                               "    .toArray()");
        });

        $("#skipWhile").click(function() {
            $("#console").text("$e(people)\n\r" +
                               "    .orderBy(function(x) { return x.age; })\n\r" +
                               "    .skipWhile(function(x) { return x.age < 34; })");
        });

        $("#union").click(function() {
            $("#console").text("var b = $e(people).where(function(x) { return x.age === 1; }).execute()\n\r" +
                             "var c = $e(people).where(function(x) { return x.age === 3; }).execute()\n\r" +
                             "b.union(c)");
        });

        $("#select").click(function() {
            $("#console").text("$e(people)\n\r" +
                               "    .select(function(x) { return x.firstname + ' ' + x.lastname + ' is ' + x.age + 'years old' })\n\r" +
                               "    .toArray()");
        });
    });
})();