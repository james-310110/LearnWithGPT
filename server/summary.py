
import re
import os

def is_youtube_video(url):
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'
    )
    match = youtube_regex.match(url)
    return bool(match)

# # Test the function with sample URLs
# urls = [
#     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
#     "https://youtu.be/dQw4w9WgXcQ",
#     "https://www.example.com/some-page"
# ]
#
# for url in urls:
#     print(f"{url}: {is_youtube_video(url)}")

def summary_helper(links,files):
    """
       links: youtube, otherwebpage
       files: pdf
Based on all my inputs, you will generate 4 sections.
Common Themes (provide your analysis and comparison. it should be clear, concise, and easily understood)
Most Important Ideas (provide 3 most important ideas)
Make a Table (based on everything you learned, make a table with important data)
Questions I May Have (ask the 3 most relevant questions pertaining to learning the materials)
    """
    if not links and not files:
        raise ValueError("links and files is empty!")
    base_summary = """Based on all my inputs, you will generate 4 sections.
Common Themes (provide your analysis and comparison. it should be clear, concise, and easily understood)
Most Important Ideas (provide 3 most important ideas)
Make a Table (based on everything you learned, make a table with important data)
Questions I May Have (ask the 3 most relevant questions pertaining to learning the materials)."""

    links_summary = ""
    for link in links:
        if is_youtube_video(link):
            links_summary += f"\nBased on the video({link}), please give me timestamps."
            # todo
        else:
            pass
            # todo

    files_summary = ""
    for file in files:
        file_name = os.path.split(file)[-1]
        if len(file_name) > 4 and file_name[-4:].lower() == ".pdf":
            pass
            # todo
        else:
            pass
            # todo
    return base_summary + links_summary + files_summary


# urls = [
#     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
#     "https://youtu.be/dQw4w9WgXcQ",
#     "https://www.example.com/some-page"
# ]
# test_result = summary_helper(urls,[])
# print(test_result)
""" test output:
Based on all my inputs, you will generate 4 sections.
Common Themes (provide your analysis and comparison. it should be clear, concise, and easily understood)
Most Important Ideas (provide 3 most important ideas)
Make a Table (based on everything you learned, make a table with important data)
Questions I May Have (ask the 3 most relevant questions pertaining to learning the materials).
Based on the video(https://www.youtube.com/watch?v=dQw4w9WgXcQ), please give me timestamps.
Based on the video(https://youtu.be/dQw4w9WgXcQ), please give me timestamps.
"""