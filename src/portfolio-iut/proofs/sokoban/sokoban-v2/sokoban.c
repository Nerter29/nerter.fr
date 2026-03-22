/**
* @file sokoban.c
* @brief implementation of a sokoban game in c
* @author Térence CHARDES
* @version 2
* @date 20/11/2025
*
* This program simulates a sokoban game by displaying chars in the terminal
and by reading keys on the keyboard
*
*/

#include <termios.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#define UP 'z'
#define LEFT 'q'
#define DOWN 's'
#define RIGHT 'd'
#define RESTART 'r'
#define GIVE_UP 'x'
#define ZOOM '+'
#define UNZOOM '-'
#define BACK 'u'

#define SOKO_UP 'h'
#define SOKO_LEFT 'g'
#define SOKO_DOWN 'b'
#define SOKO_RIGHT 'd'
#define SOKO_UP_CRATE 'H'
#define SOKO_LEFT_CRATE 'G'
#define SOKO_DOWN_CRATE 'B'
#define SOKO_RIGHT_CRATE 'D'

#define MAX_MOVEMENT_NUMBER 500

#define SIZE 12


const char WALL = '#';
const char CRATE = '$';
const char TARGET = '.';
const char PLAYER = '@';
const char CRATE_ON_TARGET = '*';
const char PLAYER_ON_CRATE = '+';
const char SPACE = ' ';

typedef char t_board[SIZE][SIZE];
typedef char t_movementList[MAX_MOVEMENT_NUMBER];
typedef char t_boardList[MAX_MOVEMENT_NUMBER][SIZE][SIZE];

bool hasGaveUp = false;
bool hasWon = false;
bool wantToRestart = false;
bool hasConfirmedToRestart = false;

void ask_give_up_file(t_board board, bool hasGaveUp);
void ask_movement_file(t_movementList movementList, int moveCount);

int kbhit();
void load_game(t_board board, char file[]);
void save_game(t_board board, char file[]);
void save_movements(t_movementList t, int nb, char fic[]);
void get_player_position(t_board board, int* x, int* y);
void copy_ground_board(t_board board, t_board groundBoard);

void display_title();
void display_board(t_board board, int zoom);
void display_header(char *possibleKeys, 
    char fileName[50], int moveCount);
void display_everything(t_board board, int x, int y, char *possibleKeys, 
    char fileName[50], int moveCount, int zoom);
void restart(t_board board, char fileName[50], char fileNameComplete[50],  
    int* x, int* y, char *possibleKeys, int* moveCount, int zoom, 
    bool* canGoBack);
bool has_won(t_board board);

void add_movement_to_the_list(t_movementList movementList, int *moveCount, 
    char movement);
void get_direction(char key, int* directionX, int* directionY, 
    bool* wantsToMove, int* zoom, bool *goBack);
void get_movement(char key, t_movementList movementList, int *moveCount, 
    bool isMovingCrate);
void get_possible_keys(t_board board, int x, int y, char *possibleKeys);
void move_entity_on_target(t_board board, t_board groundBoard, int x, int y, 
    char entity, char entityOnTarget);
void go_back(t_boardList lastBoardList, t_board board, int *moveCount, int *x,
    int *y);
void move(t_board board, t_board groundBoard, int *x, int *y, int *moveCount,
    int* zoom, t_movementList movementList, t_boardList lastBoardList, 
    bool *canGoBack);


bool is_position_free(char position);
bool is_crate(char position);

int main(){
    t_board board;
    t_board groundBoard;
    t_boardList lastBoardList;
    t_movementList movementList;

    char possibleKeys[9] = "";
    int x;
    int y;
    int moveCount = 0; // count of the PLAYER moves
    char fileName[50];
    char fileNameComplete[50];
    int zoom = 1;
    bool canGoBack = false;

    system("clear");
    display_title();
    printf("Niveaux disponibles : \n\n"); //display the name of every .sok
    
    system("ls | grep .sok | cut -d \'.\' -f 1");
    printf("\nentre le nom du niveau que tu veux charger : ");
    scanf("%s", fileName);
    char temp[60];
    sprintf(temp, "%s.sok", fileName); // asign fileName.sok 
    strcpy(fileNameComplete, temp); // to fileNameComplete
    load_game(board, fileNameComplete);
    copy_ground_board(board, groundBoard);
    get_player_position(board, &x, &y);
    display_everything(board, x, y, possibleKeys, 
        fileName, moveCount, zoom);

    while(!hasGaveUp && !hasWon){
        if(kbhit()){
            move(board, groundBoard, &x, &y, &moveCount, &zoom, movementList, 
                lastBoardList, &canGoBack);
            if(wantToRestart){
                if(hasConfirmedToRestart){
                    restart(board, fileName, fileNameComplete, &x, &y, 
                        possibleKeys, &moveCount, zoom, &canGoBack);
                }
                else{
                    printf("Tu veux vrament perdre tout ça ? (réappuie sur %c si t\'es sur)", RESTART);
                }
            }
            else{
                display_everything(board, x, y, possibleKeys, fileName, 
                    moveCount, zoom);
                if(has_won(board)){
                    hasWon = true;
                    printf("Bien joué, tu as gagné au jeu le plus dur au monde !!!\n");
                    printf("Tu as complété le niveau \"%s\" en %d mouvements, pas mal !\n",
                        fileName, moveCount);
                }
            }
        }
    }
    ask_give_up_file(board, hasGaveUp);
    ask_movement_file(movementList, moveCount);
    printf("A la prochaine !\n");
    return 0;
}

void ask_give_up_file(t_board board, bool hasGaveUp){
    if(hasGaveUp){
        char saveFile[50];
        printf("Mais nan, t\'as abandonné ? Si jamais tu veux conserver ta progression, comment tu veux que s'appelle la sauvegarde ? (entre %c si tu veux pas sauvegarder) ", GIVE_UP);
        scanf("%s", saveFile);
        char giveUpStr[2] = {GIVE_UP, '\0'};
        if(strcmp(saveFile, giveUpStr) != 0){
            char temp[60];
            sprintf(temp, "%s.sok", saveFile); 
            strcpy(saveFile, temp);
            // asign saveFile.sok to saveFile
            save_game(board, saveFile);
            printf("fichier sauvegardé ! \n");
        }
    }
}

void ask_movement_file(t_movementList movementList, int moveCount){
    char movementFile[50];
    printf("Juste avant de te libérer, comment souhaites-tu que le fichier des déplacements s'appelle ? (entre %c si tu veux pas sauvegarder) ", GIVE_UP);
    scanf("%s", movementFile);
    char giveUpStr[2] = {GIVE_UP, '\0'};
    if(strcmp(movementFile, giveUpStr) != 0){
        char temp[60];
        sprintf(temp, "%s.dep", movementFile); 
        strcpy(movementFile, temp);
        // asign saveFile.sok to saveFile
        save_movements(movementList, moveCount, movementFile);
        printf("fichier sauvegardé ! \n");
    }

}

int kbhit(){
	// la fonction retourne :
	// 1 si un caractere est present
	// 0 si pas de caractere présent
	int unCaractere = 0;
	struct termios oldt, newt;
	int ch;
	int oldf;

	// mettre le terminal en mode non bloquant
	tcgetattr(STDIN_FILENO, &oldt);
	newt = oldt;
	newt.c_lflag &= ~(ICANON | ECHO);
	tcsetattr(STDIN_FILENO, TCSANOW, &newt);
	oldf = fcntl(STDIN_FILENO, F_GETFL, 0);
	fcntl(STDIN_FILENO, F_SETFL, oldf | O_NONBLOCK);

	ch = getchar();

	// restaurer le mode du terminal
	tcsetattr(STDIN_FILENO, TCSANOW, &oldt);
	fcntl(STDIN_FILENO, F_SETFL, oldf);

	if(ch != EOF){
		ungetc(ch, stdin);
		unCaractere = 1;
	} 
	return unCaractere;
}
void load_game(t_board board, char file[]){ // function "charger_partie"
    FILE * f;
    char finDeLigne;

    f = fopen(file, "r");
    if (f == NULL){
        printf("ERREUR SUR FICHIER");
        exit(EXIT_FAILURE);
    } else {
        for (int ligne = 0 ; ligne < SIZE ; ligne ++){
            for (int colonne = 0 ; colonne < SIZE ; colonne ++){
                fread(&board[ligne][colonne], sizeof(char), 1, f);
            }
            fread(&finDeLigne, sizeof(char), 1, f);
        }
        fclose(f);
    }
}
void save_game(t_board board, char file[]){  
    FILE * f;
    char finDeLigne = '\n';

    f = fopen(file, "w");
    for (int ligne = 0 ; ligne < SIZE ; ligne ++){
        for (int colonne = 0 ; colonne < SIZE ; colonne ++){
            fwrite(&board[ligne][colonne], sizeof(char), 1, f);
        }
        fwrite(&finDeLigne, sizeof(char), 1, f);
    }
    fclose(f);
}
void save_movements(t_movementList t, int nb, char fic[]){
    FILE * f;

    f = fopen(fic, "w");
    fwrite(t, sizeof(char), nb, f);
    fclose(f);
}


void get_player_position(t_board board, int* x, int* y){
    //fills x and y whith the coordinates of the PLAYER or the PLAYER_ON_CRATE
    for(int column = 0; column < SIZE; column ++){
        for(int row = 0; row < SIZE; row ++){
            if(board[column][row] == PLAYER || 
            board[column][row] == PLAYER_ON_CRATE){
                *x = row;
                *y = column;
            }
        }
    }
}
void copy_ground_board(t_board board, t_board groundBoard){
    // Creates groundBoard : a copy of the ground 
    // of board (only spaces and TARGET) to know what can 
    // be under entities
    for (int i = 0; i < SIZE; i ++){
        for (int j = 0; j < SIZE; j ++){
            if(board[i][j] == CRATE || board[i][j] == PLAYER){
                groundBoard[i][j] = SPACE;
            }   
            else if (board[i][j] == PLAYER_ON_CRATE 
                || board[i][j] == CRATE_ON_TARGET){
                groundBoard[i][j] = TARGET;
            }
            else{
                groundBoard[i][j] = board[i][j];
            }
        }
    }
}

void copy_board(t_board origin, t_board destination) {
    //makes a perfect copy of origin into destination
    for (int i = 0; i < SIZE; i ++) {
        for (int j = 0; j < SIZE; j ++) {
            destination[i][j] = origin[i][j];
        }
    }
}


void display_title(){
    printf("\
                        _/                  _/                          \n     _/_/_/    _/_/    _/  _/      _/_/    _/_/_/      _/_/_/  _/_/_/   \n  _/_/      _/    _/  _/_/      _/    _/  _/    _/  _/    _/  _/    _/  \n     _/_/  _/    _/  _/  _/    _/    _/  _/    _/  _/    _/  _/    _/   \n_/_/_/      _/_/    _/    _/    _/_/    _/_/_/      _/_/_/  _/    _/    \n");
}

void display_board(t_board board, int zoom){ // function "afficher_plateau"
    //displays the board but consider the entities on targets as simple 
    //entities. This function ignores blank lines

    int blankCount;
    int column = 0;
    int row = 0; 
    bool fileOver = false;
    while(column < SIZE && !fileOver){
        for(int i = 0; i < zoom; i ++){
            blankCount = 0;
            row = 0;
            while (row < SIZE){
                for(int j = 0; j < zoom; j ++){
                    char currentChar = board[column][row];
                    //if any entity is on a TARGET, this function doesn't care
                    if(currentChar == PLAYER_ON_CRATE){
                        printf("%c", PLAYER);
                    }
                    else if(currentChar == CRATE_ON_TARGET){
                        printf("%c", CRATE);
                    }
                    else{
                        printf("%c", currentChar);
                        if(currentChar == ' '){ //we count blank chars in every
                        // row
                            blankCount ++;
                        }
                    }
                }
                row ++;
            }
            printf("\n");
            if(blankCount == SIZE * zoom){ // if a row is essencially composed
            // with blank chars, we call it a day, end of the display
                fileOver = true;
            }
        }
        column ++;
    }
}
void display_header(char *possibleKeys, char fileName[50], int moveCount){ // function "afficher_entete"
    printf("T\'es en train de jouer au niveau \"%s\" de ce super jeu (sokoban pour rappel)\n", fileName);
    printf("Les contrôles sont : %c %c %c %c - > haut gauche bas droite; %c pour abandonner, %c pour recommencer, %c pour zoomer, %c pour dézoomer et %c pour retourner en arrière\nSi jamais, t\'es le %c !\n", UP, 
LEFT, DOWN, RIGHT, GIVE_UP, RESTART, ZOOM, UNZOOM, BACK, PLAYER);
    printf("Dans ce cas partcilier, tu peux faire les déplacements: %s\n", 
possibleKeys); 
    printf("T\'as fais %d déplacements !\n\n", moveCount);
    
}
void display_everything(t_board board, int x, int y, char *possibleKeys, 
    char fileName[50], int moveCount, int zoom){
    system("clear");
    get_possible_keys(board, x, y, possibleKeys);
    display_title();
    display_header(possibleKeys, fileName, moveCount);
    display_board(board, zoom);
}

void restart(t_board board, char fileName[50], char fileNameComplete[50],
    int* x, int* y, char *possibleKeys, int* moveCount, int zoom, 
    bool* canGoBack){
    //reset all variables and recall the functions of the beginning
    wantToRestart = false;
    hasConfirmedToRestart = false;
    *canGoBack = false;
    *moveCount = 0;
    load_game(board, fileNameComplete);
    get_player_position(board, x, y);
    display_everything(board, *x, *y, possibleKeys, fileName, *moveCount, 
        zoom);
    
}

bool has_won(t_board board){ // function "gagne"
    //if any simple CRATE (not a CRATE_ON_TARGET) is on the map, 
    // has_won = false
    bool won = true;
    for(int column = 0; column < SIZE; column ++){
        for(int row = 0; row < SIZE; row ++){
            if(board[column][row] == CRATE){
                won = false;
            }
        }
    }
    return won;
}

void add_movement_to_the_list(t_movementList movementList, int *moveCount, 
    char movement){
    if(*moveCount < MAX_MOVEMENT_NUMBER)
    movementList[*moveCount] = movement;
}

void get_direction(char key, int* directionX, int* directionY, 
    bool* wantsToMove, int* zoom, bool *goBack){
    //tells the direction based on input keys by filling exit arguments
    switch(key){
        case UP:
            *directionY = -1;
            *wantsToMove = true;
            break;
        case LEFT:
            *directionX = -1;
            *wantsToMove = true;
            break;
        case DOWN:
            *directionY = 1;
            *wantsToMove = true;
            break;
        case RIGHT:
            *directionX = 1;
            *wantsToMove = true;
            break;
        case GIVE_UP:
            hasGaveUp = true;
            break;
        case RESTART:
            if(wantToRestart){
                hasConfirmedToRestart = true;
            }
            else{
                wantToRestart = true;
            }
            break;
        case ZOOM:
            if (*zoom <= 2){
                *zoom += 1;
            }
            break;
        case UNZOOM:
            if (*zoom >= 2){
                *zoom -= 1;
            }
            break;
        case BACK:
            *goBack = true;
            break;
    }
    if(key != RESTART){
        wantToRestart = false;
    }
}
void get_movement(char key, t_movementList movementList, int *moveCount, 
    bool isMovingCrate){
    //to know which movement was made to add it to the list
    switch(key){
        case UP:
            if(isMovingCrate)
            {add_movement_to_the_list(movementList, moveCount, 
            SOKO_UP_CRATE);}
            else
            {add_movement_to_the_list(movementList, moveCount, SOKO_UP);}
            break;
        case RIGHT:
            if(isMovingCrate)
            {add_movement_to_the_list(movementList, moveCount, 
            SOKO_RIGHT_CRATE);}
            else
            {add_movement_to_the_list(movementList, moveCount, SOKO_RIGHT);}
            break;
        case DOWN:
            if(isMovingCrate)
            {add_movement_to_the_list(movementList, moveCount, 
            SOKO_DOWN_CRATE);}
            else
            {add_movement_to_the_list(movementList, moveCount, SOKO_DOWN);}
            break;
        case LEFT:
            if(isMovingCrate)
            {add_movement_to_the_list(movementList, moveCount, 
            SOKO_LEFT_CRATE);}
            else
            {add_movement_to_the_list(movementList, moveCount, SOKO_LEFT);}
            break;
        
    }
}
void get_possible_keys(t_board board, int x, int y, char *possibleKeys){
    //fills a string of the possible keys that can be pressed to move 
    //the PLAYER. It was not asked but i miss unterstood the instructions
    //and now it is there
    possibleKeys[0] = '\0'; // clear string

    if(is_position_free(board[y - 1][x]) || (is_crate(board[y - 1][x])
    && is_position_free(board[y - 2][x]))){
        char spacedChar[3] = {UP, ' ', '\0'}; //bc I want to add "z ", not "z"
        strcat(possibleKeys, spacedChar); //strcat means possibleKeys += "z"
    }
    if(is_position_free(board[y][x - 1]) || (is_crate(board[y][x - 1])
    && is_position_free(board[y][x - 2]))){
        char spacedChar[3] = {LEFT, ' ', '\0'};
        strcat(possibleKeys, spacedChar);
    }
    if(is_position_free(board[y + 1][x]) || (is_crate(board[y + 1][x])
    && is_position_free(board[y + 2][x]))){
        char spacedChar[3] = {DOWN, ' ', '\0'};
        strcat(possibleKeys, spacedChar);
    }
    if(is_position_free(board[y][x + 1]) || (is_crate(board[y][x + 1])
    && is_position_free(board[y][x + 2]))){
        char spacedChar[3] = {RIGHT, ' ', '\0'};
        strcat(possibleKeys, spacedChar);
    }
}
void move_entity_on_target(t_board board, t_board groundBoard, int x, int y, 
    char entity, char entityOnTarget){
    // if an entity (CRATE or PLAYER) overlaps a TARGET, the entity change 
    // arcodingly. If the ground is a TARGET, a CRATE would become a 
    // CRATE_ON_TARGET
    if(groundBoard[y][x] == TARGET){
        board[y][x] = entityOnTarget;
    }
    else{
        board[y][x] = entity;
    }

}
void go_back(t_boardList lastBoardList, t_board board, int *moveCount, int *x,
    int *y){ // function annuler
    // When we go back, we load the last board by using the lastBoard List and we remove a moveCount
    copy_board(lastBoardList[*moveCount], board);
    get_player_position(board, x, y);
    *moveCount -= 1;
    
    
}
void move(t_board board, t_board groundBoard, int *x, int *y, int* moveCount, 
    int* zoom, t_movementList movementList, t_boardList lastBoardList, 
    bool *canGoBack){ // function "deplacer"
    char key = getchar();
    bool wantsToMove = false;
    bool goBack = false;
    int directionX = 0; 
    int directionY = 0; 
    get_direction(key, &directionX, &directionY, &wantsToMove, 
    zoom, &goBack);

    if(goBack && *canGoBack && *moveCount > 0){ 
        go_back(lastBoardList, board, moveCount, x, y);
    }
    *canGoBack = true;
    copy_board(board, lastBoardList[*moveCount + 1]);
    
    if(wantsToMove){
        int nextX = *x + directionX;
        int nextY = *y + directionY;
        char nextPosition = board[nextY][nextX];
        if(is_crate(nextPosition) 
        && is_position_free(board[nextY + directionY][nextX + directionX])){
            // if the next postition is a box and the position behind that box
            // is free
            move_entity_on_target(board, groundBoard, nextX + directionX, 
            nextY + directionY, CRATE, CRATE_ON_TARGET);
            board[nextY][nextX] = PLAYER;
            board[*y][*x] = groundBoard[*y][*x]; //when something moves, 
            //its position is replaced with the floor (SPACE or TARGET)
            *x = nextX;
            *y = nextY;
            get_movement(key, movementList, moveCount, true);
            (*moveCount) ++;
        }
        else if(is_position_free(nextPosition)){ //if the next postion is free
            move_entity_on_target(board, groundBoard, nextX, nextY, PLAYER, 
            PLAYER_ON_CRATE);
            board[*y][*x] = groundBoard[*y][*x];
            *x = nextX;
            *y = nextY;
            get_movement(key, movementList, moveCount, false);

            (*moveCount) ++;
        }
        //the else is when nextPostion is a WALL or a double CRATE or a CRATE
        //and a WALL - > we don't move
    }
}

bool is_position_free(char position){
    //tells if a certain position is free (a TARGET or a SPACE)
    return position == SPACE || position == TARGET;
}
bool is_crate(char position){
    //tells if a certain position is a CRATE or a CRATE_ON_TARGET
    return position == CRATE || position == CRATE_ON_TARGET;
}