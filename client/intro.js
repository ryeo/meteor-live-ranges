var showTrees = true;

/* outer annotation function */
function attachOuterAnnotation (htmlFunc) {
  var onMaterialize = function (liveRange) {
    printMaterialization("2", "Outer", liveRange);
  };

  return annotate("outer", htmlFunc, onMaterialize);
}

/* inner annotation function */
function attachInnerAnnotation (htmlFunc) {
  var onMaterialize = function (liveRange) {
    printMaterialization("1", "Inner", liveRange);
  };

  return annotate("inner", htmlFunc, onMaterialize);
}

/* raw html function similar to a Handlebars compiled template function */
function html () {
  return "<div id='first'>First HTML Node</div><div id='last'>Last HTML Node</div>";
}

/* template function similar to a Meteor template */
function template () {
  return attachOuterAnnotation(function () {
    return attachInnerAnnotation(html);
  });
}

/* main method */
function intro () {
  printAnnotations(template, "Phase 1: Annotate");
  console.log("");
  logWithColor("Phase 2: Materialize", "black");
  document.body.appendChild(Spark.render(template));
}
