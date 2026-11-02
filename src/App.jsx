const channels = [
  { id: "founders", label: "for-founders", lock: true },
  { id: "chat", label: "talk-to-william", dot: true },
  // removed: { id: "outreach", label: "activity-log", badge: "3" },
  { id: "meetings", label: "meetings", badge: "2" },
  { id: "pipeline", label: "results" },
];

const navItems = [
  { id: "chat", label: "William", Icon: IconChat, badge: null },
  // removed: { id: "outreach", label: "Activity", Icon: IconMail, badge: "3" },
  { id: "meetings", label: "Meetings", Icon: IconCalendar, badge: "2" },
  { id: "pipeline", label: "Results", Icon: IconPipeline, badge: null },
  { id: "founders", label: "Founders", Icon: IconLock, badge: null },
];

const views = {
  chat: <ChatView />,
  pipeline: <PipelineView />,
  // removed: outreach: <OutreachView />,
  meetings: <MeetingsView />,
  founders: <ForFoundersView onNav={setPage} />,
};

{{ chat: "talk-to-william", pipeline: "results", meetings: "meetings", founders: "for-founders" }[page]}
