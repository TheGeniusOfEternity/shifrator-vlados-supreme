import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

const App = () => {
  return (
    <div style={{ padding: 20 }}>
      <Card title="Тест PrimeReact">
        <InputText placeholder="Введи текст" />
        <Button label="Кнопка" icon="pi pi-check" severity="success" />
        <Button label="Опасность" />
      </Card>
    </div>
  );
}

export default App;