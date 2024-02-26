// @ts-nocheck
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals: { getSession } }: Parameters<LayoutServerLoad>[0]) => {
  return {
    session: await getSession(),
  }
}