const re = /^(|Webkit|ms|Moz|O)(borderImage(Outset|Slice|Width)|box(Flex|(Flex|Ordinal)Group)|(animationIteration|column)Count|flex(|Grow|Positive|Shrink|Negative|Order)|grid(Row|Column)(|End|Span|Start)|fontWeight|line(Clamp|Height)|opacity|or(der|phans)|tabSize|widows|zIndex|zoom|(fill|flood|stop|stroke)Opacity|stroke(Dash(array|offset)|Miterlimit|Width))$/

export default function (name) {
  return re.test(name)
}
