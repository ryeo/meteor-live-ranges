function logWithColor (msg, color) {
  console.log("%c" + msg, "color:" + color + ";font-weight: bold;");
}

function annotate (name, htmlFunc, onMaterialize) {
  var renderer = Spark._currentRenderer.get(),
      html;

  if (!renderer) return htmlFunc();

  html = renderer.annotate(
    htmlFunc(),
    name,
    onMaterialize
  );

  return html;
}

function printAnnotations (htmlFunc, title) {
  title = title || "Annotated Html:";
  var r = new Spark._Renderer;
  var annotatedHtml = Spark._currentRenderer.withValue(r, htmlFunc);
  logWithColor(title);
  logWithColor(annotatedHtml, "red");
  return annotatedHtml;
}

function renderToBody (htmlFunc) {
  document.body.appendChild(Spark.render(htmlFunc));
}

function printVisitTree (range) {
  var colorStack = [];
  var usedColors = {};

  var tabs = function (amount) {
    var tab = "\t", indendation = "";

    for (var i = 1; i < amount; i++) {
      indendation += tab;
    }
    return indendation;
  };

  var createColor = function () {
    var isColorTaken = true,
        color;

    while (isColorTaken) {
      color = d3.hsl(Math.random() * 360, .8, .4).toString();
      isColorTaken = !!usedColors[color];
    }

    usedColors[color] = true;
    return color;
  };

  var printTreeNode = function (isStart, caption) {
    var color, msg, indent = "";

    if (isStart) {
      color = createColor();
      colorStack.push(color);
      indent = tabs(colorStack.length);
      msg = "<" + caption + ">";
    } else {
      indent = tabs(colorStack.length);
      color = colorStack.pop();
      msg = "</" + caption + ">";
    }

    logWithColor(indent + msg, color);
  };

  var visitRange = function (isStart, range) {
    printTreeNode(isStart, "LiveRange " + range.type);
  };

  var visitNode = function (isStart, node) {
    printTreeNode(isStart, "HTML Node " + node.toString());
  }

  range.visit(visitRange, visitNode);
}

function createCommentFrag (comment) {
  var frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(comment));
  return frag;
}

function printMaterialization (count, name, range) {
  if (!showTrees) return;

  console.log("");
  logWithColor(count + ". Materializing " + name + " annotation with LiveRange:", "blue"); 
  console.log(range);
  console.log("");
  logWithColor(name + " LiveRange Tree: ", "orange");
  printVisitTree(range);
}

