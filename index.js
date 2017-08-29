function katex_answer_match(origin, dest) {
    return origin.replace(/\s+/g, '') === dest.replace(/\s+/g, '')
}