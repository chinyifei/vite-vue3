<template>
  <div class="box">
    <div id="calendar" ref="calendarRef"></div>

    <div class="space">
      <div class="ul">
        <div class="li">1</div>
        <div class="li">2</div>
        <div class="li">3</div>
        <div class="li">4</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Calendar from '@toast-ui/calendar'

const calendarRef = ref(null)
const calendar = ref<Calendar>()
function formatTime(time) {
  const hours = `${time.getHours()}`.padStart(2, '0')
  const minutes = `${time.getMinutes()}`.padStart(2, '0')

  return `${hours}:${minutes}`
}
onMounted(() => {
  const calendarEl = calendarRef.value
  const options = {
    // defaultView: 'month',
    // defaultView: 'week',
    defaultView: 'month',
    isReadOnly: false,

    useFormPopup: true,
    useDetailPopup: true,
    timezone: {
      zones: [
        {
          timezoneName: 'Asia/Shanghai', // 北京时区名称
          displayLabel: 'Beijing', // 显示标签
        },
      ],
    },
    calendars: [
      {
        id: 'cal1',
        name: 'Personal',
        backgroundColor: '#03bd9e',
      },
      {
        id: 'cal2',
        name: 'Work',
        backgroundColor: '#00a9ff',
      },
    ],
  }
  calendar.value = new Calendar(calendarEl, options)
  calendar.value.createEvents([
    {
      id: 'event1',
      calendarId: 'cal2',
      title: 'Weekly meeting',
      start: '2024-10-30T09:00:00',
      end: '2024-10-31T10:00:00',
    },
    {
      id: 'event2',
      calendarId: 'cal1',
      title: 'Lunch appointment',
      start: '2024-10-30T12:00:00',
      end: '2024-10-30T13:00:00',
    },
    {
      id: 'event3',
      calendarId: 'cal2',
      title: 'Vacation',
      start: '2024-10-08',
      end: '2024-10-30',
      isAllday: true,
      category: 'allday',
    },
  ])
  const someEventHandler = (e) => {
    console.log('some event fired', e)
  }

  calendar.value.on('myCustomEvent', someEventHandler)
  calendar.value.fire('myCustomEvent', {
    myCustomEvent: 'myCustomEvent',
  })
  calendar.value.on('clickEvent', ({ event }) => {
    console.log(event) // EventObject
  })
  // calendar.value.setOptions({
  //   useFormPopup: true,
  //   useDetailPopup: true,
  // })
  //更换主题
  calendar.value.setTheme({
    common: {
      gridSelection: {
        backgroundColor: 'rgba(81, 230, 92, 0.05)',
        border: '1px dotted #515ce6',
      },
    },
  })

  // 自定义模版
  calendar.value.setOptions({
    month: {
      visibleEventCount: 6,
    },
    template: {
      time(event) {
        const { start, end, title } = event

        return `<span style="color: white;">${formatTime(start)}~${formatTime(end)} ${title}~~</span>`
      },
      allday(event) {
        // console.log('event', event)
        const { start, end, title } = event
        return `<span style="color: gray;">${formatTime(start)}~${formatTime(end)} ${title}</span>`
      },
      //活动表单弹出窗口中自定义“全天”文本。
      popupIsAllday() {
        return '全天'
      },
      popupStateFree() {
        return '关闭'
      },
      popupStateBusy() {
        return '开启'
      },
      titlePlaceholder() {
        return 'Title'
      },
      locationPlaceholder() {
        return 'ocation'
      },
      popupUpdate() {
        return '更新'
      },
      popupDetailTitle({ title }) {
        return title
      },
      popupDetailLocation(params) {
        console.log('params', params)
        return params.location
      },
      popupDetailBody({ body }) {
        console.log('body', body)

        return body
      },
    },
  })
  // Creating an event through popup
  calendar.value.on('beforeCreateEvent', (eventObj) => {
    calendar.value.createEvents([
      {
        ...eventObj,
        id: Math.random().toString(16).slice(2),
      },
    ])
  })
  calendar.value.on('beforeCreateSchedule', (e) => {
    console.log('beforeCreateSchedule', e)
    // open a your creation popup
    /*...*/

    // then close guide element(blue box from dragging or clicking days)
    e.guide.clearGuideElement()
  })

  // console.log(calendar.value.renderToString())
  // console.log(calendar.value.getEvent())
})
</script>

<style lang="scss">
select {
  color: black;
}
.box {
  #calendar {
    width: 100%;
    height: 800px;
  }
  .toastui-calendar-content {
    color: rgb(151, 148, 148);
    background-color: initial;
  }
  .space {
    background-color: aquamarine;
    .ul {
      display: flex;
      justify-content: space-between;
      .li {
        max-width: 100px;
      }
    }
  }
}
</style>
