def analyze(comments):
    """
    comments = [
        {"text": "...", "likes": 10, "sentiment": "positive"},
        {"text": "...", "likes": 2, "sentiment": "negative"}
    ]
    """

    positive = 0
    negative = 0
    neutral = 0

    # optional like-weight score
    positive_score = 0
    negative_score = 0

    for c in comments:
        sentiment = c.get("sentiment", "neutral")
        likes = c.get("likes", 0)

        if sentiment == "positive":
            positive += 1
            positive_score += (1 + likes)

        elif sentiment == "negative":
            negative += 1
            negative_score += (1 + likes)

        else:
            neutral += 1

    total = len(comments)

    if total == 0:
        return {
            "total": 0,
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "positive_percent": 0,
            "negative_percent": 0,
            "final_result": "NO DATA"
        }

    positive_percent = round((positive / total) * 100, 2)
    negative_percent = round((negative / total) * 100, 2)

    # final decision using score
    if positive_score > negative_score:
        final_result = "POSITIVE"
    elif negative_score > positive_score:
        final_result = "NEGATIVE"
    else:
        final_result = "NEUTRAL"

    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "positive_percent": positive_percent,
        "negative_percent": negative_percent,
        "positive_score": positive_score,
        "negative_score": negative_score,
        "final_result": final_result
    }
