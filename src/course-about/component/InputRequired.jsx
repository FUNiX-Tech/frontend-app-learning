import { useEffect, useState } from "react";
import CollapsibleCustom from "./CollapsibleCustom";


const InputRequired = ({inputRequired}) =>{

    const [liElements, setLiElements] = useState([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputRequired, 'text/html');


    const liElements = Array.from(doc.querySelectorAll('li'));


    setLiElements(liElements);
  }, [inputRequired]);

    return (
        <CollapsibleCustom title="Yêu cầu đầu vào">
        <ul className="">
          {liElements.map((li, liIndex) => (
            <li key={liIndex} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
          ))}
        </ul>
      </CollapsibleCustom>
    )
}

export default InputRequired