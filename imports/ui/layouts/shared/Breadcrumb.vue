<template>
  <transition-group name="breadcrumb-slide">
		<div class="breadcrumb-item" v-for="(item, index) in items" :key="item.text">
			<v-icon v-if="index > 0" color="primary">
				mdi:mdi-chevron-right
			</v-icon>
			<a @click="routeTo(item)"
			   :class="{active: index === last}"
			   class="text-subtitle-1">
				{{ item.text }}
			</a>
		</div>
  </transition-group>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

  interface BreadcrumbItem {
    text: string;
    to: { name: any; };
    disabled: boolean;
  }

	export default defineComponent({
		name: 'Breadcrumb',
		data: () => ({
			items: [] as BreadcrumbItem[]
		}),
		watch: {
			'$route'() {
				this.updateList();
			}
		},
		mounted() {
			this.updateList();
		},
		methods: {
			routeTo(item: BreadcrumbItem): void {
				if (item.to.name) {
					this.$router.push(item.to);
				} else if (!item.disabled){
					this.$router.push('/');
				}
			},
			updateList(): void {
				let matched = this.$route.matched;
				this.items = matched
					.filter(routeItem => routeItem.meta.breadcrumb)
					.map(routeItem => ({
						text: routeItem.meta.breadcrumb as string,
						to: { name: routeItem.meta.name },
						disabled: !routeItem.meta.name
					}));
			}
		},
		computed: {
			last(): number {
				return this.items.length - 1;
			}
		}
	})
</script>

<style scoped lang="sass">
#breadcrumb
  list-style: none
  display: inline-block
  padding: 5px
  .icon
    font-size: 14px

div.breadcrumb-item
  float: left
  a
    color: black
    font-weight: 300
    cursor: pointer
    &.active
      color: var(--v-primary-base)
      font-weight: 500
      cursor: default

.breadcrumb-slide-enter-active
  transition: all .5s ease-out

.breadcrumb-slide-leave-active
  transition: all .5s ease-in

.breadcrumb-slide-enter-from, .breadcrumb-slide-leave-to
  transform: translateX(100vw)

</style>
