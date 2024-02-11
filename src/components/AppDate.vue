<template>
  <span :title="normalizeTime">
    {{ normalizeTimeStamp }}
  </span>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default {
  props: {
    timeStamp: {
      required: true,
      type: [Number, Object]
    },
  },
  computed: {
    normalizedUnionTimeStamp(){
      return this.timeStamp?.seconds || this.timeStamp;
    },
    normalizeTimeStamp() {
      return dayjs.unix(this.normalizedUnionTimeStamp).fromNow();
    },
    normalizeTime() {
      return dayjs.unix(this.normalizedUnionTimeStamp).format("llll");
    },
  },
};
</script>
