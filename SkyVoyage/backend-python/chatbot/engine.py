import re

def process_query(query: str) -> str:
    """
    Core NLP Engine for SkyVoyage Elite.
    Ported from the monolithic legacy implementation.
    """
    ls_text = query.lower()

    # Rule-based Intent Mapping
    if re.search(r"baggage|luggage|kg|weight", ls_text):
        return "On SkyVoyage Elite, you automatically enjoy 25kg checked premium baggage and 10kg cabin baggage. Shall I assist with booking extra weight for your journey?"
    
    elif re.search(r"cancel|refund|change", ls_text):
        return "Premium Flexi suites are fully refundable up to 24 hours prior to departure. Saver suites are subject to a nominal rescheduling fee."
    
    elif re.search(r"hello|hi|namaste|hey", ls_text):
        return "Namaste. I am your SkyVoyage Elite Concierge. How may I elevate your journey today?"
    
    elif re.search(r"food|meal|drink|menu", ls_text):
        return "Our SkyVoyage Masterchefs prepare seasonal, multi-course meals tailored to your dietary preferences, served with complimentary champagne in our Elite cabins."
    
    elif re.search(r"cabin|seat|class", ls_text):
        return "We offer Elite First Class Suites and Voyager Premium Economy. Each is designed for maximum celestial comfort. Would you like to view our cabin gallery?"

    return "Our celestial concierge is processing your request. As an Elite member, I am here to assist with any queries regarding your upcoming luxury voyage. How can I guide you today?"
