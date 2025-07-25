import { getUserNotebooks, createNewNotebook } from "@/app/actions/notebooks"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Book } from "lucide-react"

export default async function NotebooksPage() {
  const notebooks = await getUserNotebooks()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Notebooks</h1>
        <form action={createNewNotebook}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="name"
              placeholder="New notebook name"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
            <Button type="submit">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </form>
      </div>

      {notebooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Book className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h2 className="text-xl font-medium mb-2">No notebooks yet</h2>
          <p className="text-gray-400 mb-6">Create your first notebook to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map((notebook) => (
            <Link
              key={notebook.id}
              href={`/dashboard/notebook/${notebook.id}`}
              className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Book className="h-6 w-6 text-blue-400" />
                <h2 className="text-lg font-medium">{notebook.name}</h2>
              </div>
              <p className="text-sm text-gray-400">Created on {new Date(notebook.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
