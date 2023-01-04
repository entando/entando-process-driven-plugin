import React from 'react';

import WIDGETS_CONFIG from '../../mocks/app-builder/widgets';

import '../index.css';
import '../main-content-layouts.css';

const SmartInboxPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get('taskId');
  const taskPos = urlParams.get('taskPos');

  return (
    <div className="pda-wrapper">
      <header className="pda-header">
        <div className="header-container">
          <div className="header-logo">
            <a href="/">
              <svg width="132" height="39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="url(#pattern0)" d="M0 0h132v39H0z" />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0" transform="matrix(.00394 0 0 .01333 0 -.346)" />
                  </pattern>
                  <image
                    id="image0"
                    width="254"
                    height="127"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </a>
          </div>
          <div className="header-controls">
            {/* <!-- SEARCH BAR WIDGET (FRAME 0)-->
              <@wp.show frame=0 />
              <!-- END OF SEARCH BAR WIDGET (FRAME 0)-->
              <!-- NOTIFICATION WIDGET (FRAME 1)-->
              <@wp.show frame=1 />
              <!-- END OF NOTIFICATION WIDGET (FRAME 1)-->
              <!-- AUTHENTICATION WIDGET (FRAME 2)-->
              <@wp.show frame=2 />
              <!-- END OF AUTHENTICATION WIDGET (FRAME 2)--> */}
          </div>
        </div>
      </header>
      <aside className="pda-sidebar">
        {/* <!-- SIDEBAR WIDGET (FRAME 3&4)-->
        <@wp.show frame=3 />
        <@wp.show frame=4 />
        <!-- END OF SIDEBAR WIDGET (FRAME 3&4)--> */}
        <div style={{ padding: '30px 12px 12px 12px', display: 'flex' }}>
          <ul className="pda-navigation" style={{ listStyleType: 'none' }}>
            <li>
              <a href="/smart-inbox-page/">Smart Inbox</a>
            </li>
            <li>
              <a href="/task-details-page/">Task details</a>
            </li>
          </ul>
        </div>
      </aside>
      <main className="pda-content">
        <div className="content-wrapper smart-inbox-page">
          <div className="frame5">
            <task-list
              service-url="/pda"
              page-code={WIDGETS_CONFIG.TASK_LIST.pageCode}
              frame-id={WIDGETS_CONFIG.TASK_LIST.frameId}
            />
          </div>
          <div className="frame6">
            <task-details
              service-url="/pda"
              id={taskId} // WIDGETS_CONFIG.TASK_DETAILS.taskId
              task-pos={taskPos}
              page-code={WIDGETS_CONFIG.TASK_DETAILS.pageCode}
              frame-id={WIDGETS_CONFIG.TASK_DETAILS.frameId}
            />
          </div>
          <div className="frame7">
            <task-comments
              service-url="/pda"
              id={taskId} // WIDGETS_CONFIG.TASK_COMMENTS.taskId
              page-code={WIDGETS_CONFIG.TASK_COMMENTS.pageCode}
              frame-id={WIDGETS_CONFIG.TASK_COMMENTS.frameId}
            />
          </div>
          <div className="frame8">
            <task-attachments
              service-url="/pda"
              id={taskId} // WIDGETS_CONFIG.ATTACHMENTS.taskId
              page-code={WIDGETS_CONFIG.ATTACHMENTS.pageCode}
              frame-id={WIDGETS_CONFIG.ATTACHMENTS.frameId}
            />
          </div>
        </div>
      </main>
      <footer className="pda-footer" />
    </div>
  );
};

export default SmartInboxPage;
