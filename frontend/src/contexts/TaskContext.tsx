import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

import type { ExecuteTaskResponse } from '@/services/taskService'

interface TaskContextType {
  taskResult: ExecuteTaskResponse | null
  setTaskResult: React.Dispatch<
    React.SetStateAction<ExecuteTaskResponse | null>
  >
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [taskResult, setTaskResult] =
    useState<ExecuteTaskResponse | null>(null)

  return (
    <TaskContext.Provider
      value={{
        taskResult,
        setTaskResult,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTask must be used inside TaskProvider')
  }

  return context
}