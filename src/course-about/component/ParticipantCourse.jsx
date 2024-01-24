import { useEffect, useState } from "react";
import CollapsibleCustom from "./CollapsibleCustom";

const ParticipantCourse = ({ participant }) => {
  const [liElements, setLiElements] = useState([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(participant, 'text/html');


    const liElements = Array.from(doc.querySelectorAll('li'));


    setLiElements(liElements);
  }, [participant]);

  return (
    <div>
      <CollapsibleCustom title="Đối tượng tham gia">
        <ul className="">
          {liElements.map((li, liIndex) => (
            <li key={liIndex} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
          ))}
        </ul>
      </CollapsibleCustom>
    </div>
  );
};

export default ParticipantCourse;
