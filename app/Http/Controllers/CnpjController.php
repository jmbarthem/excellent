<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CnpjController extends Controller
{
    public function consultar(Request $request, $cnpj)
    {
        try {
            $token = 'INFORME O SEU TOKEN DE ACESSO'; // Se tiver um token, caso contrário deixe como ''
            $response = Http::get("https://publica.cnpj.ws/cnpj/$cnpj", [
                'token' => $token
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                return response()->json(['error' => 'CNPJ não encontrado ou excedeu o limite de consultas'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
