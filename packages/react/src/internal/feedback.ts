/** Non-interactive feedback accepts container metadata, never handlers or ARIA
 * that could replace the visible content or introduce widget/live semantics. */
export function feedbackAttributes(props: object, component: string) {
  for (const key of Object.keys(props)) {
    if (!['id','style','lang','dir'].includes(key) && !/^data-[\w-]+$/.test(key)) {
      throw new Error(`OwlA11y: ${component} does not support ${key}.`);
    }
  }
}
