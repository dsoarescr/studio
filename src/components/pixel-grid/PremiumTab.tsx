export default function PremiumTab() {
  const highlightOptions = [
    {
      id: 'gold',
      name: 'Destaque Ouro',
      price: 5,
      duration: '24h',
      features: ['Topo da grid', 'Badge dourado']
    },
    {
      id: 'animation',
      name: 'Efeito Animado',
      price: 7,
      duration: '7 dias',
      features: ['Pulsação suave', 'Destaque em listagens']
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Melhore sua visibilidade</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {highlightOptions.map((option) => (
          <div key={option.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{option.name}</h3>
            <div className="my-2">
              <span className="text-2xl font-bold">€{option.price}</span>
              <span className="text-muted-foreground">/{option.duration}</span>
            </div>
            <ul className="text-sm space-y-1 mb-4">
              {option.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded">
              Selecionar
            </button>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        * Os destaques renovam automaticamente. Cancele a qualquer momento.
      </div>
    </div>
  );
}
