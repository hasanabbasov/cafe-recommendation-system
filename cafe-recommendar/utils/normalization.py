def normalize_scores(results):
    scores = [item['score'] for item in results]
    min_score = min(scores) if scores else 0
    max_score = max(scores) if scores else 1
    range_score = max_score - min_score if max_score != min_score else 1
    return {
        item['cafe_id']: (item['score'] - min_score) / range_score
        for item in results
    }