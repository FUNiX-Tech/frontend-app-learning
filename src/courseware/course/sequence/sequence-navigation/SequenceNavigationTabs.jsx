import React,{useEffect,useState} from 'react';
import PropTypes from 'prop-types';
import {useModel} from '../../../../generic/model-store'

import UnitButton from './UnitButton';
import SequenceNavigationDropdown from './SequenceNavigationDropdown';
import useIndexOfLastVisibleChild from '../../../../generic/tabs/useIndexOfLastVisibleChild';

import sequence from '..';



export default function SequenceNavigationTabs({
  unitIds, unitId, showCompletion, onNavigate,courseId,title
}) {
  const [
    indexOfLastVisibleChild,
    containerRef,
    invisibleStyle,
  ] = useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  //Right side bar scrolling hander
  useEffect(() => {
    // Get the fixed element
    const fixedElement = document.querySelector('#courseware-sequenceNavigation');
    const instructorToolbar = document.querySelector('#instructor-toolbar')
    const header = document.querySelector('.learning-header')
    const headerHeight = header.offsetHeight
    const courseTagsNav = document.querySelector('#courseTabsNavigation')
    const courseTagsNavHeight = courseTagsNav.offsetHeight;
     let instructorToolbarHeight = 0;
     if(instructorToolbar){
      instructorToolbarHeight = instructorToolbar.offsetHeight;
      fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight +instructorToolbarHeight +'px'
      
     }else{
      fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight+'px'
     }
  
    
  
    // Adjust position on scroll
    const handleScroll = () => {
     
      if(window.scrollY >=137.5){
      fixedElement.style.paddingTop = headerHeight +'px'
      return;
      
      }
      else if(window.scrollY>=50 && window.scrollY <85.5){
        if(instructorToolbar){
      fixedElement.style.paddingTop = courseTagsNavHeight +instructorToolbarHeight- window.scrollY + 'px'
      return;

        }else{
          fixedElement.style.paddingTop =courseTagsNavHeight - window.scrollY + 'px'
          return;
        }
      }
      
      else if(window.scrollY>=122 && window.scrollY <137.5){
        if(instructorToolbar){
      fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight +instructorToolbarHeight- window.scrollY + 'px'
      return;

        }else{
          fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight - window.scrollY + 'px'
          return;
        }
        
      }
      else if(window.scrollY>=85.5 && window.scrollY <122){
        if(instructorToolbar){
      fixedElement.style.paddingTop = courseTagsNavHeight +30 +instructorToolbarHeight- window.scrollY + 'px'
      return;

        }else{
          fixedElement.style.paddingTop = courseTagsNavHeight+30 - window.scrollY + 'px'
          return;
        }
        
      }
      else if(window.scrollY <=50){
        if(instructorToolbar){
          fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight +instructorToolbarHeight - window.scrollY + 'px'
          return;
    
            }else{
              fixedElement.style.paddingTop = headerHeight+courseTagsNavHeight- window.scrollY + 'px'
              return;
            }
      }
   
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  
   

  return (
    <div style={{ flexBasis: '100%', minWidth: 0 }}>
      <div className="sequence-navigation-tabs-container" ref={containerRef}>
        <div
          className="sequence-navigation-tabs d-flex flex-grow-1"
          style={shouldDisplayDropdown ? null : null}
        > 
        <div className="sequence-lesson-title"><h2 className="lesson-title">{title}</h2></div>
         
          {unitIds.map(buttonUnitId => (
            <UnitButton
              key={buttonUnitId}
              unitId={buttonUnitId}
              isActive={unitId === buttonUnitId}
              showCompletion={showCompletion}
              onClick={onNavigate}
            />
          ))}
        </div>
      </div>
      {/* {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          onNavigate={onNavigate}
          showCompletion={showCompletion}
          unitIds={unitIds}
        />
      )} */}
    </div>
  );
}

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
