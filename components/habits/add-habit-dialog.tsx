import { HabitFormDialog } from "./habit-form-dialog";

/** Convenience wrapper: the add flavour of HabitFormDialog. */
export function AddHabitDialog({ trigger }: { trigger: React.ReactNode }) {
  return <HabitFormDialog trigger={trigger} />;
}
