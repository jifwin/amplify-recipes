import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

client.queries.sayHello({
    name: "Amplify",
})

function App() {
  const [recipes, Recipes] = useState<Array<Schema["Recipes"]["type"]>>([]);

  useEffect(() => {
    client.models.Recipes.observeQuery().subscribe({
      next: (data) => Recipes([...data.items]),
    });
  }, []);

  function createRecipe() {
    client.models.Recipes.create({ content: window.prompt("Recipe X") });
  }

  return (
    <main>
      <h1>My recipes</h1>
      <button onClick={createRecipe}>+ new</button>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
