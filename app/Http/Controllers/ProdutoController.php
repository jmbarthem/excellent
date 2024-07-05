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
        Log::info('Dados recebidos para inserção:', $request->all());

        $validatedData = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor_venda' => 'required|numeric',
            'estoque' => 'required|integer',
            'imagens' => 'nullable|array',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        Log::info('Dados validados:', $validatedData);

        $produto = Produto::create($validatedData);

        // Verificação para garantir que a requisição possui arquivos de imagem
        if ($request->hasFile('imagens')) {
            Log::info('Imagem(ns) encontrada(s) na requisição.');
            foreach ($request->file('imagens') as $imagem) {
                // Verificação se o arquivo é válido
                if ($imagem->isValid()) {
                    $path = $imagem->store('produtos', 'public');
                    ProdutoImagem::create([
                        'produto_id' => $produto->id,
                        'path' => $path,
                    ]);
                } else {
                    Log::error('Imagem inválida encontrada: ', ['imagem' => $imagem]);
                }
            }
        } else {
            Log::info('Nenhuma imagem encontrada na requisição.');
        }



        return response()->json($produto->load('imagens'), 201);
    }


    public function show($id)
    {
        return Produto::with('imagens')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        Log::info('Dados recebidos para atualização:', $request->all());
        $produto = Produto::findOrFail($id);

        $validatedData = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor_venda' => 'required|numeric',
            'estoque' => 'required|integer',
            'imagens' => 'nullable|array',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        $produto->update($validatedData);

        // Lógica de atualização de imagens
        if ($request->hasFile('imagens')) {
            // Remover as imagens antigas (se existirem)
            foreach ($produto->imagens as $imagem) {
                Storage::disk('public')->delete($imagem->path);
                $imagem->delete();
            }


            // Adicionar as novas imagens
            foreach ($request->file('imagens') as $imagem) {
                if ($imagem->isValid()) {
                    $path = $imagem->store('produtos', 'public');
                    ProdutoImagem::create([
                        'produto_id' => $produto->id,
                        'path' => $path,
                    ]);
                } else {
                    Log::error('Imagem inválida encontrada: ', ['imagem' => $imagem]);
                }
            }
        }

        return response()->json($produto->load('imagens'), 200);
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
