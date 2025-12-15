import re

# def chunk_text(text,chunk_size=500,overlap=50):
#     chunks=[]
#     start=0
#     text_length = len(text)
    
#     while start < text_length:
#         end = min(start + chunk_size, text_length)
#         chunks.append(text[start:end])
#         start += chunk_size - overlap
    
#     return chunks


def chunk_text(text, chunk_size=500, overlap=90):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_length = len(sentence)

        if current_length + sentence_length > chunk_size:
            chunks.append(" ".join(current_chunk))
            
            # overlap: keep last few sentences
            overlap_sentences = []
            overlap_length = 0
            for s in reversed(current_chunk):
                overlap_length += len(s)
                overlap_sentences.insert(0, s)
                if overlap_length >= overlap:
                    break

            current_chunk = overlap_sentences
            current_length = sum(len(s) for s in current_chunk)

        current_chunk.append(sentence)
        current_length += sentence_length

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
