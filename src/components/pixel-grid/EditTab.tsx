export default function EditTab() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Área de Edição</h3>
        <div className="h-64 bg-muted rounded flex items-center justify-center">
          [Preview do Pixel será renderizado aqui]
        </div>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded">Pincel</button>
        <button className="px-4 py-2 border rounded">Formas</button>
        <button className="px-4 py-2 border rounded">Texto</button>
        <button className="px-4 py-2 border rounded">Cores</button>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 border rounded">Cancelar</button>
        <button className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
      </div>
    </div>
  );
}
