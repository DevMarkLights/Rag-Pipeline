# from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load LLM (small for Pi, large models on laptop/cloud)
# model_name = "openlm-research/open_llama_3b"
# tokenizer = AutoTokenizer.from_pretrained(model_name,use_fast=False)
# model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

# generator_llm = pipeline("text-generation", model=model, tokenizer=tokenizer)

# def generator(context,question):
    
#     # context = retrieve_context(question)
#     prompt = f"Answer the question based on the context below:\n\nContext:\n{context}\n\nQuestion: {question}\nAnswer:"

#     output = generator_llm(prompt, max_new_tokens=200, do_sample=True, temperature=0.7)
#     return output[0]["generated_text"]