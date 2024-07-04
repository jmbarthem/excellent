<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;
use App\Models\ProdutoImagem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProdutoController extends Controller
{
    public function index()
    {
        return Produto::with('imagens')->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor_venda' => 'required|numeric',
            'estoque' => 'required|integer',
            'imagens' => 'sometimes|array',
            'imagens.*' => 'sometimes|file|image|max:2048'
        ]);

        $produto = Produto::create($validatedData);

        if ($request->has('imagens')) {
            foreach ($request->file('imagens') as $imagem) {
                $path = $imagem->store('produtos', 'public');
                ProdutoImagem::create([
                    'produto_id' => $produto->id,
                    'path' => $path,
                ]);
            }
        }

        return response()->json($produto, 201);
    }

    public function show($id)
    {
        return Produto::with('imagens')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        Log::info('Dados recebidos para atualização:', $request->all());

        $validatedData = $request->validate([
            'descricao' => 'string|max:255',
            'valor_venda' => 'numeric',
            'estoque' => 'integer',
            'imagens' => 'nullable|array',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $produto = Produto::findOrFail($id);
        $produto->update($validatedData);

        if ($request->has('imagens')) {
            foreach ($produto->imagens as $imagem) {
                Storage::disk('public')->delete($imagem->path);
                $imagem->delete();
            }

            foreach ($request->file('imagens') as $imagem) {
                $path = $imagem->store('produtos', 'public');
                $produto->imagens()->create(['path' => $path]);
            }
        }

        return response()->json($produto, 200);
    }





    public function destroy($id)
    {
        $produto = Produto::findOrFail($id);
        foreach ($produto->imagens as $imagem) {
            Storage::disk('public')->delete($imagem->path);
            $imagem->delete();
        }
        $produto->delete();
        return response()->json(null, 204);
    }
}
