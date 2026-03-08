def get_sentiment(rating=None, comment=""):
    """Returns: positive / negative / neutral 
    Works with: - dataset ratings - user ratings - user comments"""
    # 1️⃣ RATING BASED SENTIMENT
    if rating is not None and rating != "":
        try:
            rating = int(float(rating))
            if rating <= 2:
                return "negative"
            elif rating == 3:
                return "neutral"
            elif rating >= 4:
                return "positive"
        except:
            pass
    # 2️⃣ COMMENT TEXT SENTIMENT
    text = str(comment).lower()
    positive_words = [
        "good", "great", "excellent", "nice",
        "love", "amazing", "best", "happy",
        "satisfied", "helpful"
    ]
    negative_words = [
        "bad", "worst", "poor", "useless", "terrible",
        "hate", "problem", "issue", "slow",
        "delay", "angry"
    ]
    for word in positive_words:
        if word in text:
            return "positive"
    for word in negative_words:
        if word in text:
            return "negative"
    # 3️⃣ DEFAULT
    return "neutral"
