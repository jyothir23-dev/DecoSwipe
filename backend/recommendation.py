def get_style_preference(liked_furniture):

    style_counts = {}

    for item in liked_furniture:

        styles = item.get("style", "").split("•")

        for style in styles:

            style = style.strip()

            if style:
                style_counts[style] = style_counts.get(style, 0) + 1

    if not style_counts:
        return "No preference yet"

    preferred_style = max(
        style_counts,
        key=style_counts.get
    )

    return preferred_style