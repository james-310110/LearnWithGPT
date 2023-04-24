import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

interface MarkdownProps {
  markdown: string;
}

const md = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return "";
  },
  html: true,
  linkify: true,
  typographer: true,
});

export default function InputBox(props: MarkdownProps) {
  var result = md.render(props.markdown);
  return (
    <div
      className="lh-base fst-normal paragraph"
      dangerouslySetInnerHTML={{ __html: result }}
    ></div>
  );
}
